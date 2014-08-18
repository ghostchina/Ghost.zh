import ValidationEngine from 'ghost/mixins/validation-engine';
import NProgressSaveMixin from 'ghost/mixins/nprogress-save';
import SelectiveSaveMixin from 'ghost/mixins/selective-save';

var User = DS.Model.extend(NProgressSaveMixin, SelectiveSaveMixin, ValidationEngine, {
    validationType: 'user',

    uuid: DS.attr('string'),
    name: DS.attr('string'),
    slug: DS.attr('string'),
    email: DS.attr('string'),
    image: DS.attr('string'),
    cover: DS.attr('string'),
    bio: DS.attr('string'),
    website: DS.attr('string'),
    location: DS.attr('string'),
    accessibility: DS.attr('string'),
    status: DS.attr('string'),
    language: DS.attr('string', {defaultValue: 'en_US'}),
    meta_title: DS.attr('string'),
    meta_description: DS.attr('string'),
    last_login: DS.attr('moment-date'),
    created_at: DS.attr('moment-date'),
    created_by: DS.attr('number'),
    updated_at: DS.attr('moment-date'),
    updated_by: DS.attr('number'),
    roles: DS.hasMany('role', { embedded: 'always' }),

    role: Ember.computed('roles', function (name, value) {
        if (arguments.length > 1) {
            //Only one role per user, so remove any old data.
            this.get('roles').clear();
            this.get('roles').pushObject(value);
            return value;
        }
        return this.get('roles.firstObject');
    }),

    // TODO: Once client-side permissions are in place,
    // remove the hard role check.
    isAuthor: Ember.computed.equal('role.name', 'Author'),
    isEditor: Ember.computed.equal('role.name', 'Editor'),
    isAdmin: Ember.computed.equal('role.name', 'Administrator'),
    isOwner: Ember.computed.equal('role.name', 'Owner'),

    saveNewPassword: function () {
        var url = this.get('ghostPaths.url').api('users', 'password');
        return ic.ajax.request(url, {
            type: 'PUT',
            data: {
                password: [{
                    'oldPassword': this.get('password'),
                    'newPassword': this.get('newPassword'),
                    'ne2Password': this.get('ne2Password')
                }]
            }
        });
    },

    resendInvite: function () {
        var fullUserData = this.toJSON(),
            userData = {
            email: fullUserData.email,
            roles: fullUserData.roles
        };

        return ic.ajax.request(this.get('ghostPaths.url').api('users'), {
            type: 'POST',
            data: JSON.stringify({users: [userData]}),
            contentType: 'application/json'
        });
    },

    passwordValidationErrors: function () {
        var validationErrors = [];

        if (!validator.equals(this.get('newPassword'), this.get('ne2Password'))) {
            validationErrors.push({message: '新密码不匹配'});
        }

        if (!validator.isLength(this.get('newPassword'), 8)) {
            validationErrors.push({message: '密码长度至少要8个字符'});
        }

        return validationErrors;
    }.property('password', 'newPassword', 'ne2Password'),

    isPasswordValid: Ember.computed.empty('passwordValidationErrors.[]'),
    active: function () {
        return _.contains(['active', 'warn-1', 'warn-2', 'warn-3', 'warn-4', 'locked'], this.get('status'));
    }.property('status'),
    invited: function () {
        return _.contains(['invited', 'invited-pending'], this.get('status'));
    }.property('status'),
    pending: Ember.computed.equal('status', 'invited-pending').property('status')
});

export default User;
