YUI.add('ez-contentmodel', function (Y) {
    "use strict";
    /**
     * Provides the Content model class
     *
     * @module ez-contentmodel
     */

    Y.namespace('eZ');

    /**
     * Content model
     *
     * @namespace eZ
     * @class Content
     * @constructor
     * @extends Model
     */
    Y.eZ.Content = Y.Base.create('contentModel', Y.eZ.RestModel, [], {

        sync: function (action, options, callback) {
            var api = options.api;

            if ( action === 'read' ) {
                api.getContentService().loadContentInfoAndCurrentVersion(
                    this.get('id'), callback
                );
            } else {
                callback("Only read operation is supported at the moment");
            }
        },

        /**
         * Parses the response from the eZ Publish REST API
         *
         * @method parse
         * @param {Object} response the response object from the eZ JS REST Client
         * @return {Object} attribute hash
         */
        parse: function (response) {
            var content;

            try {
                content = Y.JSON.parse(response.body);
            } catch (ex) {
                /**
                 * Fired when a parsing error occurs
                 *
                 * @event error
                 * @param {String} src "parse"
                 * @param {String} error the error message
                 * @param {Object} response the response object that failed to
                 * be parsed
                 */
                this.fire('error', {
                    src: 'parse',
                    error: "No content in the response",
                    response: response
                });
                return null;
            }
            return this._parseStruct(content.Content);
        }

    }, {
        ATTRS_REST_MAP: [
            'alwaysAvailable', 'lastModificationDate',
            'mainLanguageCode', 'publishedDate',
            {'_remoteId': 'remoteId'},
            {'Name': 'name'},
            {'_id': 'contentId'}
        ],
        LINKS_MAP: [
            'Owner', 'MainLocation', 'ContentType'
        ],
        ATTRS: {

            /**
             * The content id of the content in the eZ Publish repository
             *
             * @attribute contentId
             * @default ''
             * @type string
             */
            contentId: {
                value: ''
            },

            /**
             * The name of the content
             *
             * @attribute name
             * @default ''
             * @type string
             */
            name: {
                value: ''
            },

            /**
             * The remote id of the content in the eZ Publish repository
             *
             * @attribute remoteId
             * @default ''
             * @type string
             */
            remoteId: {
                value: ''
            },

            /**
             * The always available flag of the content
             *
             * @attribute alwaysAvailable
             * @default false
             * @type boolean
             */
            alwaysAvailable: {
                setter: '_setterBoolean',
                value: false
            },

            /**
             * The last modification date of the content
             *
             * @attribute lastModificationDate
             * @default epoch
             * @type Date
             */
            lastModificationDate: {
                setter: '_setterDate',
                value: new Date(0)
            },

            /**
             * The main language code of the content (eng-GB, fre-FR, ...)
             *
             * @attribute mainLanguageCode
             * @default ''
             * @type string
             */
            mainLanguageCode: {
                value: ''
            },

            /**
             * The published date of the content
             *
             * @attribute publishedDate
             * @default epoch
             * @type Date
             */
            publishedDate: {
                setter: '_setterDate',
                value: ''
            }
        }
    });

});
