/*
 * Copyright (C) eZ Systems AS. All rights reserved.
 * For full copyright and license information view LICENSE file distributed with this source code.
 */
YUI.add('ez-emailaddress-editview', function (Y) {
    "use strict";
    /**
     * Provides the field edit view for the Email Address (ezemail) fields
     *
     * @module ez-emailaddress-editview
     */

    Y.namespace('eZ');

    /* jshint -W101 */
    var FIELDTYPE_IDENTIFIER = 'ezemail',
        VALIDATION_PATTERN = /^((\"[^\"\f\n\r\t\v\b]+\")|([A-Za-z0-9_\!\#\$\%\&\'\*\+\-\~\/\^\`\|\{\}]+(\.[A-Za-z0-9_\!\#\$\%\&\'\*\+\-\~\/\^\`\|\{\}]+)*))@((\[(((25[0-5])|(2[0-4][0-9])|([0-1]?[0-9]?[0-9]))\.((25[0-5])|(2[0-4][0-9])|([0-1]?[0-9]?[0-9]))\.((25[0-5])|(2[0-4][0-9])|([0-1]?[0-9]?[0-9]))\.((25[0-5])|(2[0-4][0-9])|([0-1]?[0-9]?[0-9])))\])|(((25[0-5])|(2[0-4][0-9])|([0-1]?[0-9]?[0-9]))\.((25[0-5])|(2[0-4][0-9])|([0-1]?[0-9]?[0-9]))\.((25[0-5])|(2[0-4][0-9])|([0-1]?[0-9]?[0-9]))\.((25[0-5])|(2[0-4][0-9])|([0-1]?[0-9]?[0-9])))|((([A-Za-z0-9\-])+\.)+[A-Za-z\-]{2,}))$/;
    /* jshint +W101 */

    /**
     * Email Address edit view
     *
     * @namespace eZ
     * @class EmailAddressEditView
     * @constructor
     * @extends eZ.FieldEditView
     */
    Y.eZ.EmailAddressEditView = Y.Base.create('emailAddressEditView', Y.eZ.FieldEditView, [], {
        events: {
            '.ez-emailaddress-input-ui input': {
                'blur': 'validate',
                'valuechange': '_validateIfNotValid'
            }
        },

        /**
         * Validates the current input of email address
         *
         * @method validate
         */
        validate: function () {
            var validity = this._getInputValidity();

            if ( validity.typeMismatch || !this._isValidEmail() ) {
                this.set('errorStatus', 'The value should be a valid email address');
            } else if ( validity.valueMissing ) {
                this.set('errorStatus', 'This field is required');
            } else {
                this.set('errorStatus', false);
            }
        },

        /**
         * Validates the input only if it is not valid already.
         * This approach allows not to nag the user with error messages while
         * he inputs value for the first time (before a blur from the input),
         * at the same time allowing real-time response once a mistake is
         * corrected.
         *
         * @method _validateIfNotValid
         * @protected
         */
        _validateIfNotValid: function () {
            if (!this.isValid()) {
                this.validate();
            }
        },

        /**
         * Defines the variables to imported in the field edit template for
         * email address.
         *
         * @protected
         * @method _variables
         * @return {Object} containing isRequired entry
         */
        _variables: function () {
            return {
                "isRequired": this.get('fieldDefinition').isRequired
            };
        },

        /**
         * Returns the input validity state object for the input generated by
         * the email address template
         *
         * See https://developer.mozilla.org/en-US/docs/Web/API/ValidityState
         *
         * @protected
         * @method _getInputValidity
         * @return {ValidityState}
         */
        _getInputValidity: function () {
            return this.get('container').one('.ez-emailaddress-input-ui input').get('validity');
        },

        /**
         * Returns the currently filled email
         *
         * @protected
         * @method _getFieldValue
         * @return String
         */
        _getFieldValue: function () {
            return this.get('container').one('.ez-emailaddress-input-ui input').get('value');
        },

        /**
         * Checks email address validity based on the same regexp as
         * the one used in the EmailAddress FieldType. Regexp is tested only
         * if field is not empty.
         * Otherwise, the email address edit view could accept email
         * that will be considered invalid when creating/updating a content.
         *
         * @protected
         * @method _isValidEmail
         * @return {Boolean}
         */
        _isValidEmail: function () {
            if (this._getFieldValue().length > 0) {
                return VALIDATION_PATTERN.test(this._getFieldValue());
            }
            return true;
        }
    });

    Y.eZ.FieldEditView.registerFieldEditView(
        FIELDTYPE_IDENTIFIER, Y.eZ.EmailAddressEditView
    );
});
