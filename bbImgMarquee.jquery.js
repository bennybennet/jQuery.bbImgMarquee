/**
 * EARLY ALPHA
 * Author: Benny Bennet Jürgens
 * Version: 0.1.0
 *
 * The MIT License (MIT)
 * Copyright (c) 2013 Benny Bennet Jürgens
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
;(function( $ ) {
    "use strict";

    $.fn.bbImgMarquee = function( options ) {
        options = $.extend(true, options, $.fn.bbImgMarquee.defaults);

        var _movePlate = function( windowWidth ) {
            var $el = $( this );
            var plateWidth = $el.outerWidth();

            var left = parseInt($el.css('left'));
            if( isNaN(left) ) left = 0;
            if( Math.abs(left) >= (plateWidth - windowWidth) ) {
                left = 0;
            } else {
                if( (Math.abs(left) + (2 * windowWidth)) > plateWidth ) { // right border reached
                    left = (plateWidth - windowWidth) * -1;
                } else if( (left % windowWidth) === 0 ) { // everything is normal, e.g. there was no stop on mouseover
                    left -= windowWidth;
                } else {
                    left -= (windowWidth - (Math.abs(left) % windowWidth));
                }
            }
            $el.animate({
                left: left
            }, options.animSpeed);
        };

        this.each(function() {
            var $this = $( this );
            var plate = $this.find('[class*=__plate]');

            var windowWidth = $( $(this).find('[class*=__window]')[0] ).width();
            var plateWidth = 0;
            $(plate).children().each(function() {
                plateWidth += $(this).outerWidth(true);
            });
            $(plate).css({
                'width': plateWidth + "px",
                'position': 'relative'
            });
            plate.move = _movePlate; // TODO: Is this really cool?
            var startIntervall = function() { return window.setInterval(function() { plate.move( windowWidth ); }, options.intervall); };

            var intervalID = startIntervall();
            $this.find('[class*=__next]').click(function() {
                plate.move( windowWidth );
                window.clearInterval( intervalID );
                intervalID = startIntervall();
            });
            if( options.stopOnMouseOver ) {
                $(plate).mouseover(function() {
                    $(this).stop();
                    window.clearInterval( intervalID );
                })
                .mouseleave(function() {
                    intervalID = startIntervall();
                });
            }
        });
        return this;
    }

    $.fn.bbImgMarquee.defaults = {
        intervall: 15000,
        stopOnMouseOver: true,
        animSpeed: 1500
    };

})( jQuery );