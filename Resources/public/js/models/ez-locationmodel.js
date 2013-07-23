YUI.add('ez-locationmodel', function (Y) {
    "use strict";
    /**
     * Provides the Location model cass
     *
     * @module ez-locationmodel
     */

    Y.namespace('eZ');

    /**
     * Location model
     *
     * @namespace eZ
     * @class Location
     * @constructor
     * @extends Model
     */
    Y.eZ.Location = Y.Base.create('locationModel', Y.eZ.RestModel, [], {

        sync: function (action, options, callback) {
            var api = options.api;

            if ( action === 'read' ) {
                api.getContentService().loadLocation(
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
            var loc;

            try {
                loc = Y.JSON.parse(response.body);
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
                    error: "No location in the response",
                    response: response
                });
                return null;
            }

            return this._parseStruct(loc.Location);
        }

    }, {
        ATTRS_REST_MAP: [
            'childCount', 'depth', 'hidden', 'invisible', 'pathString',
            'priority', 'remoteId', 'sortField', 'sortOrder',
            {'id': 'locationId'}
        ],
        ATTRS: {
            /**
             * The location's number of child
             *
             * @attribute childCount
             * @default 0
             * @type integer
             */
            childCount: {
                value: 0
            },

            /**
             * The location's depth
             *
             * @attribute depth
             * @default 1
             * @type integer
             */
            depth: {
                value: 1
            },

            /**
             * The location's hidden flag
             *
             * @attribute hidden
             * @default false
             * @type boolean
             */
            hidden: {
                value: false
            },

            /**
             * The location's invisible flag
             *
             * @attribute invisible
             * @defaylt false
             * @type boolean
             */
            invisible: {
                value: false
            },

            /**
             * The location's id in the eZ Publish content repository
             *
             * @attribute locationId
             * @default ''
             * @type string
             */
            locationId: {
                value: ''
            },

            /**
             * The location's path string
             *
             * @attribute pathString
             * @default ''
             * @type string
             */
            pathString: {
                value: ""
            },

            /**
             * The location's priority
             *
             * @attribute priority
             * @default 0
             * @type integer
             */
            priority: {
                value: 0
            },

            /**
             * The location's remote id
             *
             * @attribute remoteId
             * @default ''
             * @type string
             */
            remoteId: {
                value: ""
            },

            /**
             * The location's sort field
             *
             * @attribute sortField
             * @default "PATH"
             * @type string
             */
            sortField: {
                value: "PATH"
            },

            /**
             * The location's sort order
             *
             * @attribute sortOrder
             * @default "ASC"
             * @type string
             */
            sortOrder: {
                value: "ASC"
            }
        }
    });

});
