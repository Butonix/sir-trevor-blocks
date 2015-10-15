(function() {
    var Locales = {
        en: {
            blocks: {
                button: {
                    title: "Button",
                    styles: {
                        backgroundColor: "Background Color",
                        borderWidth: "Border Width",
                        borderColor: "Border Color",
                        borderRadius: "Border Radius",
                        width: "Width",
                        height: "Height",
                    },
                    hint: {
                        text: '¡Escribe aqui el texto de tu Boton!',
                        href: 'Enlace'
                    }
                },
                map: {
                    title: "Map",
                    hint: "Write an address here"
                },
                widget: {
                    title: "Widget",
                    hint: "Paste your external Widget html here"
                }
            }
        }
    };

    jQuery.extend(true, SirTrevor.Locales, Locales);
})();
(function() {
    var Locales = {
        es: {
            blocks: {
                button: {
                    title: "Botón",
                    styles: {
                        backgroundColor: "Color de fondo",
                        borderWidth: "Ancho del borde",
                        borderColor: "Color del borde",
                        borderRadius: "Radio del borde",
                        width: "Ancho",
                        height: "Alto"
                    },
                    hint: {
                        text: '¡Escribe aqui el texto de tu Boton!',
                        href: 'Enlace'
                    }
                },
                map: {
                    title: "Mapa",
                    hint: "Escribe una direccion aquí"
                },
                widget: {
                    title: "Widget",
                    hint: "Pega el html de tu widget externo aquí"
                }
            }
        }
    };

    jQuery.extend(true, SirTrevor.Locales, Locales);
})();
(function() {
    "use strict";

    if (!SirTrevor)
        return console.error("SirTrevor.Blocks.Button could not load because SirTrevor wasn't found");

    var defaults = {
        "background-color": "#00CA6B".
        "width": "100%",
        "line-height": "initial",
        "border-color": "#4D4D4D",
        "border-radius": "2px",
        "border-width": "2px"
    };

    SirTrevor.Blocks.Button = SirTrevor.Block.extend({
        type: 'button',
        title: function() { return i18n.t('blocks:button:title'); },
        icon_name: 'button',

        editorHTML: function() {
            return '<div class="st-editor"><div class="st-preview"><p class="st-required st-text-block" contenteditable="true"></p></div><div class="st-row"> <input name="href" type="text"></div><div class="st-row"><div class="st-column"><div class="st-control"><div class="st-icon">C</div> <input class="st-value" name="css-background-color" type="color"></div><div class="st-control"><div class="st-icon">W</div> <input class="st-value" name="css-width" type="range" units="%" step="1" max="100" min="10"></div><div class="st-control"><div class="st-icon">H</div> <input class="st-value" name="css-line-height" type="range" units="%" step="1" max="500" min="10"></div></div><div class="st-column"><div class="st-control"><div class="st-icon">B</div> <input class="st-value" name="css-border-color" type="color"></div><div class="st-control"><div class="st-icon">B</div> <input class="st-value" name="css-border-width" type="range" units="px" step="1" max="6" min="0"></div><div class="st-control"><div class="st-icon">B</div> <input class="st-value" name="css-border-radius" type="range" units="px" step="1" max="100" min="0"></div></div></div></div>';
        },

        onBlockRender: function() {
            // Setup shortcuts
            this.$preview = this.$el.find('.st-preview'); 
            this.$css = this.$editor.find('[name^="css-"]');

            // Set the default button text
            this.$preview.find('[contenteditable="true"]').html(i18n.t("blocks:button:hint:text"));

            // Listen for css inputs changes to refresh the preview
            this.$css.on('change input', this._onCssPropertyChange.bind(this));
            // Listen for the background-color changes to refresh the foreground color
            this.$css.filter('[name="css-background-color"]').on('change input', this._onBackgroundColorChange.bind(this));

            // Add the default class and a self destroying listener for removing it
            this.$preview.addClass('default');
            this._loadDefaultProperties();
        },

        _loadDefaultProperties: function() {
            this.$css.each(function (i, el) {
                var $el = $(el);
                var property = $el.attr('name').replace(/^css\-/, '');

                var rawValue = $el.val();
                var units = $el.attr('units') || "";
                var value = rawValue + units;

                var defaultValue = defaults[property];
                var defaultValueRaw = defaultValue.replace(units, '');

                $el.val(defaultValueRaw);
            }.bind(this));
        },

        _onCssPropertyChange: function (ev) {
            var $target = $(ev.target);
            // Get the css property from the name
            var prop = $target.attr('name').replace(/^css\-/, '');
            var val = $target.val();

            if ($target.attr('units') && $target.attr('units').length > 0)
                val += $target.attr('units');

            this.$preview.css(prop, val);
        },

        _onBackgroundColorChange: function() {
            this.$preview.css('color', (this._getFontColor.bind(this))());
        },

        _getFontColor: function (hexc) {
            var hexPattern = /^#/;
            var rgbPattern = /^rgb\(.*([0-9]+).*,.*([0-9]+),.*([0-9]+).*\)/;

            var hexcolor = (hexc || this.$preview.css('background-color'));
            var r, g, b;
            if (hexPattern.test(hexcolor)) {
                hexcolor = hexcolor.substr(1);
                r = parseInt(hexcolor.substr(0,2), 16);
                g = parseInt(hexcolor.substr(2,2), 16);
                b = parseInt(hexcolor.substr(4,2), 16);
            } else if (rgbPattern.test(hexcolor)) {
                var rgbMatch = rgb.exec();
                r = parseInt(rgbMatch[1]);
                g = parseInt(rgbMatch[2]);
                b = parseInt(rgbMatch[3]);
            }

            var yiq = ((r*299) + (g*587) + (b*114)) / 1000;
            return (yiq >= 128) ? 'inherit' : '#FFFFFF';
        },
    })
})();
(function() {
    "use strict";

    if (!SirTrevor)
        return console.error("SirTrevor.Blocks.ImageEdit could not load because SirTrevor wasn't found");

    SirTrevor.Blocks.ImageEdit = SirTrevor.Blocks.Image.extend({

        title: function() { return i18n.t('blocks:image:title') },
        type: "image_edit",
        cropTimeout: 1000,

        loadData: function(data){
            // Create our image tag
            this.$editor.html($('<img>', { src: data.file.url })).show();
        },

        onDrop: function(transferData) {
            var file = transferData.files[0],
                urlAPI = (typeof URL !== "undefined") ? URL : (typeof webkitURL !== "undefined") ? webkitURL : null;

            if (/image/.test(file.type)) {
                this.$inputs.hide();
                this.$editor.html($('<img>', { src: urlAPI.createObjectURL(file) })).show();
                this.loading();
                var timerCache = null;
                var $img = this.$editor.find('>img');
                $img.cropper({
                    built: function () {
                        // Expose the $cropper at block level
                        this.$cropper = function() {
                            return $img.cropper.apply($img, arguments);
                        };
                        this.ready();
                    }.bind(this),
                    crop: function(e) {
                        // If we have a timer cache means user is cropping, cancel the previous timer
                        if (timerCache)
                            clearTimeout(timerCache);
                        else
                            SirTrevor.EventBus.trigger('image_edit:crop:start', [e]);

                        timerCache = setTimeout(function () {
                            timerCache = null;
                            SirTrevor.EventBus.trigger('image_edit:crop:finish', [e]);
                        }.bind(this), this.cropTimeout);
                    }.bind(this)
                });
            }
        },

        isEmpty: function() {
            return this.$editor.find('img').length <= 0;
        },

        _serializeData: function() {
            var url = null;

            if (this.$cropper)
                url = this.$cropper('getCroppedCanvas').toDataURL()
            else
                url = this.$editor.find('img').attr('src');

            if (url && url.length > 0)
                return  { file: { url: url } };
            else
                return null;
        },
    });
})();
(function() {
    "use strict";

    if (!SirTrevor)
        return console.error("SirTrevor.Blocks.Map could not load because SirTrevor wasn't found");

    SirTrevor.Blocks.Map = SirTrevor.Block.extend({

        type: "map",
        title: function() { return i18n.t('blocks:map:title') },
        icon_name: "map",

        default_width: 600,
        default_height: 300,
        default_zoom: 15,
        map_static_img: "https://maps.googleapis.com/maps/api/staticmap?size=<%= width %>x<%= height %>&center=<%= address %>&markers=|<%= address %>&zoom=<%= zoom %>&scale=2",
        map_link: "http://maps.google.com/maps?q=<%= address %>",

        editorHTML: function() {
            var address = $('<input>', { type: 'text', name:'address', placeholder: i18n.t('blocks:map:hint') });
            var zoom = $('<input>', { type: 'hidden', name:'zoom', value: this.default_zoom });
            var width = $('<input>', { type: 'hidden', name:'width', value: this.default_width });
            var height = $('<input>', { type: 'hidden', name:'height', value: this.default_height });
            var map = $('<div>', { class: 'map' });
            var container = $('<div>');
            container.append(address);
            container.append(zoom);
            container.append(width);
            container.append(height);
            container.append(map);
            map.css({
                'border-radius': '5px',
                'background-color': '#DDD',
                'background-position': 'center',
                'background-size': 'cover',
                'height': this.default_height + 'px',
                'width': '100%'
            });
            map.hide();
            return container.html();
        },

        inputTimeoutAmount: 1000,
        inputTimeoutId: null,
        onBlockRender: function() {
            this.$map = this.$el.find('.map');
            this.$zoom = this.$el.find('[name="zoom"]');

            var openGmaps = function() {
                window.open(this._getGmapsLink());
            }.bind(this);

            var zoomOnScroll = function (e) {

                if (!this.$map.is(':hover'))
                    return;
                e.preventDefault();

                var oEvent = e.originalEvent,
                    delta  = oEvent.deltaY || oEvent.wheelDelta;

                if (delta > 0)
                    this.$zoom.val(Math.max(0, Number(this.$zoom.val()) - 1));
                else
                    this.$zoom.val(Number(this.$zoom.val()) + 1);

                this._reloadMap();
            }.bind(this);

            // Prevent submit on enter
            this.$editor.bind('keypress keydown keyup', function (e){
                if(e.keyCode == 13) e.preventDefault();
            });

            this.$map.on('click', openGmaps);

            // If edition is enabled, zoom should be too
            if (this.$editor.is(":visible")) {
                this.$map.on('wheel mousewheel', zoomOnScroll);
                this.$editor.on('keyup change', this._reloadMap.bind(this));
            }
        },

        loadData: function(data) {
            Object.keys(data).forEach(function (key) {
                this.$el.find('[name="' + key + '"]').val(data[key]);
            }.bind(this));
            this.$editor.hide();
            this._reloadMap();
        },

        isEmpty: function() {
            return !(this.$el && this.$el.find('[name="address"]').length > 0 && this.$el.find('[name="address"]').val().length > 0);
        },

        _serializeData: function() {
            var address = this.$el.find('[name="address"]').val();

            if (!address || address.length <= 0)
                return null;

            return {
                address: address,
                zoom: this.$el.find('[name="zoom"]').val(),
                width: this.$el.find('[name="width"]').val(),
                height: this.$el.find('[name="height"]').val()
            }
        },

        _safeData: function(data) {
            var result = {};
            Object.keys(data).forEach(function(e) {
                result[e] = encodeURIComponent(data[e]);
            });
            return result;
        },

        _reloadMap: function() {
            var $map = this.$map || this.$el.find('.map');

            // Show the map if not visible
            if (!($map.is(':visible')))
                $map.show();

            // Set the UI variables for the loading effect
            if (!this.$el.hasClass('st--is-loading')) {
                this.loading();
                $map.css('opacity', '0.7');
            }

            clearTimeout(this.inputTimeoutId);
            this.inputTimeoutId = setTimeout(function() {
                this.ready();
                $map.css('opacity', '1');
                $map.css('background-image', 'url(' + (this._getGmapsStaticImage()) + ')');
            }.bind(this), this.inputTimeoutAmount);
        },

        _getGmapsLink: function() {
            return _.template(this.map_link, this._safeData(this.getData().data));
        },

        _getGmapsStaticImage: function() {
            return _.template(this.map_static_img, this._safeData(this.getData().data));
        }
    });
})();
(function() {
    "use strict";

    if (!SirTrevor)
        return console.error("SirTrevor.Blocks.VideoNoDrag could not load because SirTrevor wasn't found");

    SirTrevor.Blocks.VideoNoDrag = SirTrevor.Blocks.Video.extend({
        droppable: false,
	});
})();
(function() {
    "use strict";

    if (!SirTrevor)
        return console.error("SirTrevor.Blocks.Widget could not load because SirTrevor wasn't found");

    SirTrevor.Blocks.Widget = SirTrevor.Block.extend({

      type: "widget",
      title: function() { return i18n.t('blocks:widget:title') },
      icon_name: "code",

      pastable: true,

      paste_options: {
        html: '<div class="st-widget-editor-container"><span class="st-icon"></span><textarea class="st-paste-block" placeholder="<%= i18n.t("blocks:widget:hint") %>"></textarea></div>'
      },

      _serializeData: function() {
        return {
            format: 'html',
            text: this.$el.find('textarea').val()
        }
      },

      isEmpty: function() {
        return !(this.$el && this.$el.find('textarea').length > 0 && this.$el.find('textarea').val().length > 0);
      },

      loadData: function(data) {
        this.loadPastedContent(data.text);
      },

      onContentPasted: function(ev) {
        this.loadPastedContent($(ev.target).val());
      },

      loadPastedContent: function(code) {
        code = code || "";

        // First load the code into the text area
        this.$el.find('textarea').val(code);

        // Replace < / > for its html chars
        code = code.replace(/</g, '&lt;');
        code = code.replace(/>/g, '&gt;');
        // Prepare the containers
        var preTag = $('<pre>');
        var codeTag = $('<code>', { class: 'lang-html' });
        // Add the code to the container and highlight it
        codeTag.html(code);
        hljs.highlightBlock(codeTag.get()[0]);
        preTag.append(codeTag);
        // Add the highlighted code to the editor and remove the input box
        this.$editor.html(preTag);
        this.$inputs.hide();
      }

    });
})();