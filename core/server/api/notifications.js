// # Notifications API
// RESTful API for creating notifications
var when               = require('when'),
    _                  = require('lodash'),
    canThis            = require('../permissions').canThis,
    errors             = require('../errors'),
    utils              = require('./utils'),

    // Holds the persistent notifications
    notificationsStore = [],
    // Holds the last used id
    notificationCounter = 0,
    notifications;

/**
 * ## Notification API Methods
 *
 * **See:** [API Methods](index.js.html#api%20methods)
 */
notifications = {

    /**
     * ### Browse
     * Fetch all notifications
     * @returns {Promise(Notifications)}
     */
    browse: function browse(options) {
        return canThis(options.context).browse.notification().then(function () {
            return when({ 'notifications': notificationsStore });
        }, function () {
            return when.reject(new errors.NoPermissionError('你没有权限浏览通知.'));
        });
    },

    /**
     * ### Add
     *
     *
     * **takes:** a notification object of the form
     * ```
     *  msg = { notifications: [{
         *      type: 'error', // this can be 'error', 'success', 'warn' and 'info'
         *      message: 'This is an error', // A string. Should fit in one line.
         *      location: 'bottom', // A string where this notification should appear. can be 'bottom' or 'top'
         *      dismissible: true // A Boolean. Whether the notification is dismissible or not.
         *  }] };
     * ```
     */
    add: function add(object, options) {

        var defaults = {
                dismissible: true,
                location: 'bottom',
                status: 'persistent'
            },
            addedNotifications = [];

        return canThis(options.context).add.notification().then(function () {
            return utils.checkObject(object, 'notifications').then(function (checkedNotificationData) {
                _.each(checkedNotificationData.notifications, function (notification) {
                    notificationCounter = notificationCounter + 1;

                    notification = _.assign(defaults, notification, {
                        id: notificationCounter
                        //status: 'persistent'
                    });

                    notificationsStore.push(notification);
                    addedNotifications.push(notification);
                });

                return when({ notifications: addedNotifications});
            });
        }, function () {
            return when.reject(new errors.NoPermissionError('你没有权限添加通知.'));
        });
    },

    /**
     * ### Destroy
     * Remove a specific notification
     *
     * @param {{id (required), context}} options
     * @returns {Promise(Notifications)}
     */
    destroy: function destroy(options) {
        return canThis(options.context).destroy.notification().then(function () {
            var notification = _.find(notificationsStore, function (element) {
                return element.id === parseInt(options.id, 10);
            });

            if (notification && !notification.dismissible) {
                return when.reject(
                    new errors.NoPermissionError('你没有权限取消通知.')
                );
            }

            if (!notification) {
                return when.reject(new errors.NotFoundError('通知不存在.'));
            }

            notificationsStore = _.reject(notificationsStore, function (element) {
                return element.id === parseInt(options.id, 10);
            });
            return when({notifications: [notification]});
        }, function () {
            return when.reject(new errors.NoPermissionError('你没有权限删掉通知.'));
        });
    },

    /**
     * ### DestroyAll
     * Clear all notifications, used for tests
     *
     * @private Not exposed over HTTP
     * @returns {Promise}
     */
    destroyAll: function destroyAll(options) {
        return canThis(options.context).destroy.notification().then(function () {
            notificationsStore = [];
            notificationCounter = 0;
            return when(notificationsStore);
        }, function () {
            return when.reject(new errors.NoPermissionError('你没有权限删掉通知.'));
        });
    }
};

module.exports = notifications;
