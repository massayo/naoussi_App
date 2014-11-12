/**
 * Plugin developped by Florian GOMBERT (2012-11-05)
 * usage part1: var watchedForm = $('jQuerySelector').dirtyForm();
 * ui action: do some change in the form
 * usage part2: var isFormDirty = $(watchedForm).dirtyForm('isDirty');
 * usage part3: when it is no longer necessary to watch the watchedForm, call $(watchedForm).dirtyForm('destroy');
**/

if (typeof jQuery == 'undefined') throw ("jQuery could not be found.");

(function( $ ) {
    'use strict';

    $.fn.dirtyForm = function(method) {
        if (typeof method !== 'string')
            method = 'init';
        if ( methods[method] ) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        $.error('Method ' + method + ' does not exist on jQuery.dirtyForm.');
        return $(this);
    };

    var methods = {
        init : function() {
            var form = $(this);
            var inputs = $(':input:not(:submit,:button)', form);

            if (form.hasClass('dirtyform')) {
                form.off('.dirtyform');
            } else {
                form.addClass('dirtyform');
            }

            var changeElements = inputs.filter(':radio,:checkbox,select');
            form.on('change.dirtyform', ':radio,:checkbox,select', { inputs: changeElements }, inputChecker);
            changeElements.each(function(itr, elem) {
                var input = $(elem);
                return input.data('dirtyform-initial', getValue(input));
            });

            var keyupElements = inputs.not(':radio,:checkbox,select');
            form.on('keyup.dirtyform', ':input:not(:submit,:button,:radio,:checkbox,select)', { inputs: keyupElements }, inputChecker);
            keyupElements.each(function(itr, elem) {
                var input = $(elem);
                return input.data('dirtyform-initial', getValue(input));
            });

            return $(this);
        },

        isDirty : function() {
            var flagIsDirty = $(this).data('dirtyform-isdirty');
            if (flagIsDirty == 'undefined')
                return false;
            return flagIsDirty;
        },

        destroy : function() {
            var form = $(this);
            form.removeData('dirtyform-isdirty');
            form.off('.dirtyform');
            var inputs = $(':input:not(:submit,:button)', form);
            inputs.filter('.dirtyform-changed').removeClass('dirtyform-changed');
        }
    };

    var getValue = function (input) {
        if (input.is(':radio,:checkbox')) {
            var val = input.attr('checked');
            return (typeof val !== 'undefined') ? val : false;
        }
        return input.val();
    };

    var inputChecker = function (event) {
        var npt = $(event.target);
        var form = npt.parents('.dirtyform');
        var initial = npt.data('dirtyform-initial');
        var current = getValue(npt);
        var inputs = event.data.inputs;

        if (initial !== current)
            npt.addClass('dirtyform-changed');
        else {
            npt.removeClass('dirtyform-changed');
            if (npt.is(':radio')) {
                $(':radio[name="' + npt.attr('name') + '"]').removeClass('dirtyform-changed');
            }
        }

        return form.data('dirtyform-isdirty', (inputs.filter('.dirtyform-changed').length > 0));
    };

})( jQuery );
