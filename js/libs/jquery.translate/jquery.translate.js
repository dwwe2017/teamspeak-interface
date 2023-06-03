/**
 * @file jquery.translate.js
 * @brief jQuery plugin to translate text in the client side.
 * @author Manuel Fernandes
 * @site
 * @version 0.9
 * @license MIT license <http://www.opensource.org/licenses/MIT>
 *
 * translate.js is a jQuery plugin to translate text in the client side.
 */

(function ($)
{
    $.fn.translate = function (options)
    {
        var that = this; //a reference to ourselves

        var settings = {
            css: "trn",
            lang: "en"
        };

        settings = $.extend(settings, options || {});

        if (settings.css.lastIndexOf(".", 0) !== 0)
            settings.css = "." + settings.css;

        var t = settings.t;

        this.lang = function (l)
        {
            if (l)
            {
                settings.lang = l;
                this.translate(settings);
            }

            return settings.lang;
        };

        this.get = function (index)
        {
            var res = index;

            try
            {
                res = t[index][settings.lang];
            }
            catch (err)
            {
                return index;
            }

            if (res)
            {
                return res;
            }
            else
            {
                return index;
            }
        };

        this.g = this.get;

        this.find(settings.css).each(function (i)
        {
            var $this = $(this);

            var trn_key = $this.attr("data-trn-key");

            if (!trn_key)
            {
                trn_key = $this.html();
                $this.attr("data-trn-key", trn_key);   //store key for next time
            }

            $this.html(that.get(trn_key));
        });

        return this;
    };
})(jQuery);