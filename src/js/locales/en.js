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
                        href: 'Write an email, phone number or web URL here'
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