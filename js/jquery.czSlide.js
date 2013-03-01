/**
 * $.czSlide
 * @extends jquery.1.4.2
 * @fileOverview Make slide slide
 * @author Lancer
 * @email lancer.he@gmail.com
 * @site crackedzone.com
 * @version 1.0
 * @date 2011-09-11
 * Copyright (c) 2011-2011 Lancer
 * @example
 *    $("#banner").czSlide();
 */

(function($) {

    var czUI = czUI || {}

    $.fn.czSlide = function( options ){

        var PNAME = 'czSlide';
        var objData = $(this).data(PNAME);

        //get instance object
        if (typeof options == 'string' && options == 'instance') {
            return objData;
        }

        var options = $.extend( {}, czUI.czSlide.defaults, options || {} );

        return $(this).each(function (){
            var czSlide = new czUI.czSlide( options );
            czSlide.$element = $(this);
            czSlide.init();
            $(this).data( PNAME, czSlide );
        });
    }

    czUI.czSlide = function( options ) {
        this.NAME    = 'czSlide';
        this.VERSION = '1.0';
        this.options = options;
        this.$element= null;
    }

    czUI.czSlide.defaults = {
        auto     : true,
        speed    : 1000,
        delay    : 4000,
        zIndex   : 3,
        initCallback : null
    }

    czUI.czSlide.prototype = {

        init: function() {
            var that = this;
            this.$images  = this.$element.find('.images');
            this.$thumbs  = this.$element.find('.thumbs');
            this.counts   = this.$element.find('.images > div').length;
            this.position = this.$images.find('div.current').index();
            this.switchInt= 0;
            if ( this.counts == 1 )
                return;

            this._auto();

            this.$element.find('.thumbs > div').bind('click', function(){
				that._switch ( $(this).index() );
				clearInterval(that.switchInt);
				that._auto();
		});

            this._callback('init');
        },

        _switch: function(toPosition) {
            if ( this.position == toPosition || toPosition < 0 || toPosition >= this.counts)
                return;

            var $current   = this.$images.find('.current');
            var $toElement = this.$images.find('div:eq('+ toPosition +')');

            $current.addClass('prev');
            $toElement.css({opacity: 0})
                .remove('prev')
                .addClass('current')
                .animate({opacity: 1}, this.options.speed , function() {
                    $current.removeClass('current prev');
                });
/*
            $current.css('zIndex', this.options.zIndex + 1);
            $toElement.css({opacity: 0, zIndex: this.options.zIndex + 2})
                .animate({opacity: 1}, this.options.speed , function() {
                    $current.css('zIndex', this.options.zIndex);
                });*/
            this.position = toPosition;
        },

        _next: function() {
            var toPosition = this.position + 1;

            if(toPosition >= this.counts)
                toPosition = 0;

            this._switch( toPosition );
        },

        _auto: function() {
            if ( this.options.auto == true ) {
                var that = this;
                this.switchInt = setInterval( function() {that._next() },
                        that.options.delay );
            }
        },

        debug : function( $message ) {
            if ( typeof $message == 'undefined') $message = this;

            if ( window.console && window.console.log )
                window.console.log($message);
            else
                alert($message);
        },

        _callback: function(evt) {
            if( typeof this.options[evt + 'Callback'] != 'function')
                return;
            this.options[evt + 'Callback'].call(this);
        }
    }
})(jQuery);