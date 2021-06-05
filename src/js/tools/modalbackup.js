
var orig_source = false;

$("button.cancel, .overlay").on("click", cancelOverlays);
$("#tool_source").on("click", viewSource);
$("#tool_source_save").on("click", saveSource);

// 查看源码
function viewSource(e, forSaving) {
  editor.menu.flash($('#view_menu'));
  $('#save_output_btns').toggle(!!forSaving);
  $('#tool_source_back').toggle(!forSaving);
  // 从画布拿到字符串格式的svg源码
  orig_source = svgCanvas.getSvgString();
  // 将源码字符串绑定到编辑区域
  $('#svg_source_textarea').val(orig_source);
  $('#svg_source_editor').fadeIn();
  $('#svg_source_textarea').focus().select();
};

// 保存源码
function saveSource() {
  var saveChanges = function () {
    svgCanvas.clearSelection();
    $('#svg_source_editor').hide();
    $('#svg_source_textarea').blur();
    editor.zoom.multiply(1);
    editor.rulers.update();
    editor.paintBox.fill.prep();
    editor.paintBox.stroke.prep();
  }

  if (!svgCanvas.setSvgString($('#svg_source_textarea').val())) {
    $.confirm("There were parsing errors in your SVG source.\nRevert back to original SVG source?", function (ok) {
      if (!ok) return false;
      saveChanges();
    });
  } else {
    saveChanges();
  }
};

function cancelOverlays() {
  $('#dialog_box').hide();

  if (orig_source && orig_source !== $('#svg_source_textarea').val()) {
    $.confirm("Ignore changes made to SVG source?", function (ok) {
      if (ok) {
        $('#svg_source_editor').hide();
        $('#svg_source_textarea').blur();
      };
    });
  } else {
    $('#svg_source_editor').hide();
    $('#svg_source_textarea').blur();
  }
};

function isVisible() {
  return $('#svg_source_editor').is(":visible");
}

this.cancelOverlays = cancelOverlays;
this.isVisible = isVisible;
this.viewSource = viewSource;
this.saveSource = saveSource;