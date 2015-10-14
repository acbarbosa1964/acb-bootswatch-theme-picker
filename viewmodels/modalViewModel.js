/*
 * The MIT License (MIT)
 * Copyright (c) 2015 Antonio Carlos Barbosa. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

define(function (require, exports, module) {
	var ko = require('../vendor/knockout'),
		_ = require('../vendor/lodash'),
		tar = require('../js/themes'),
		config = require('../config'),
		ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
		NodeConnection = brackets.getModule("utils/NodeConnection"), //required
		DocumentManager = brackets.getModule("document/DocumentManager"), //required
		EditorManager = brackets.getModule("editor/EditorManager"), //required
		nodeConnection = new NodeConnection(); //required


	function ModalViewModel() {

		this.theme = ko.observable('0');
		this.image = ko.observable('1');
		this.name = ko.observable('');
		this.description = ko.observable('');
		this.bootsurl = ko.observable('');

		var previewBox = $('.preview-box');
		var imagem = $('.placeholder-preview');
		var themeBox = $('.theme-box');
		var themeOptions = '';

		themeBox.empty();

		// Append themes
		for (i=0; i< tar.themeMax; i++) {
			themeOptions = themeOptions + '<option value="'+i+'">'+tar.getThemeImage(i,1)+'</option>';
		}
		$(themeOptions).appendTo('.theme-box');

		// set Image URL
		this.url = ko.computed(function () {
			var png = tar.getThemeImage(this.theme(),0);
			var url = config.path+ 'images/' + png;
			return url;
		}, this);
		previewBox.children("img").attr("src", this.url());

		// set name
		this.name = ko.computed(function () {
			return tar.getThemeImage(this.theme(),1);
		}, this);

		// set url
		this.bootsurl = ko.computed(function () {
			return tar.getThemeImage(this.theme(),2);
		}, this);

		// set Description
		this.description = ko.computed(function () {
			return tar.getThemeImage(this.theme(),3);
		}, this);


		// When preview button is clicked
		this.onPreview = _.bind(function (model, event) {
			imagem.attr("src", this.url());
			$('.placeholder-preview').error(function () {
				previewBox.empty();
				previewBox.append('<p class="placeholder-error">Error loading image.(</p>');
			});
			event.stopPropagation();
		}, this);

		this.select = function (model, event) {
			$(event.target).select();
			return true;
		}

		this.onUrlInsert = _.bind(function (model, event) {
			var currentDoc = DocumentManager.getCurrentDocument(),
				editor = EditorManager.getCurrentFullEditor(),
				pos = editor.getCursorPos(),
				posEnd;

			var css = tar.getTheme(this.theme());
			//alert(css);

			currentDoc.replaceRange(css, pos);
			posEnd = $.extend({}, pos);
			posEnd.ch += css.length;

			editor.focus();
			editor.setSelection(pos, posEnd);
		}, this);
	}

	module.exports = ModalViewModel;
});
