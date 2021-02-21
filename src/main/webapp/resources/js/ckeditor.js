CKEDITOR.editorConfig = function (config) {

    config.extraPlugins = 'assinaturas';
    config.allowedContent = true;
    config.extraAllowedContent = '*(*);*{*}';

}

CKEDITOR.plugins.add('assinaturas', {
    init: function (editor) {
        editor.ui.addButton('Assinaturas',
            {
                label: 'Inserir bloco de assinaturas',
                command: 'AddAssinaturas',
                icon: ''
            });

        var cmd = editor.addCommand('AddAssinaturas', {
            exec: function (ed) {

                var $template = $('#AssinaturasTemplate');
                if($template.length > 0){
                    ed.insertHtml($template.html());
                } else {
                    console.error('Não foi encontrado um elemento com o ID #AssinaturasTemplate para extrair o template.');
                }

            }
        });

        CKEDITOR.domReady(function(){
            //PDF / CSS
            if(editor.document != null){
                editor.document.appendStyleSheet(PrimeFaces.getFacesResource('/css/pdf-report-common.css', 'default', PrimeFacesExt.VERSION))
                editor.document.appendStyleText('.ckeditor-deletable-block { border: dashed 8px #CCC; padding: 16px; }')
            }

            //Context menu
            if(editor.contextMenu != null){

                editor.addCommand('DeletableBlock', {
                    exec: function () {

                        if(editor.__blockToDelete != null) {
                            editor.__blockToDelete.remove();
                            delete editor.__blockToDelete;
                        }

                    }
                });

                editor.contextMenu.addListener(function(element, selection, elementPath) {
                    var $block = (element.hasClass('ckeditor-deletable-block')) ? element : elementPath.blockLimit;
                        $block = ($block != null && $block.hasClass('ckeditor-deletable-block')) ? $block : null;

                    if($block != null){
                        editor.__blockToDelete = $block;
                        return {
                            DeletableBlock : CKEDITOR.TRISTATE_ON
                        };
                    } else {
                        delete editor.__blockToDelete;
                    }

                });

                editor.addMenuItems({
                    DeletableBlock : {
                        label : 'Remover bloco',
                        command : 'DeletableBlock',
                        group : 'div',
                        order : 1
                    }
                });

            }

        });

    }
});