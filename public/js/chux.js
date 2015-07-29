(function(window, $) {

    'use strict';

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    //Chux name space
    window.Chux = {};

    window.Chux.Utils = {};

    window.Chux.Utils.quantity = parseInt($('#quantity').val());

    window.Chux.Utils.ajaxify = function($element, successCallback, errorCallback) {

        if (!$element.length) return;

        var tagName = $element[0].tagName.toLowerCase();

        switch(tagName) {

            case 'form':
                $element.on('submit', function(event) {
                    event.preventDefault();
                    $.ajax({
                        type: $element.attr('method') || 'GET',
                        url: $element.attr('action'),
                        data: $element.serialize(),
                        success: function(response) {
                            successCallback.call($element[0], response);
                        },
                        error: function(xhr, status, err) {
                            errorCallback.call($element[0], xhr.responseJSON);
                        }
                    })
                });

                break;
            default :
                break;
        }

    };

    window.Chux.Utils.updateQueryStringParameter = function(uri, key, value) {
        var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        var separator = uri.indexOf('?') !== -1 ? "&" : "?";
        if (uri.match(re)) {
            return uri.replace(re, '$1' + key + "=" + value + '$2');
        }
        else {
            return uri + separator + key + "=" + value;
        }
    };


    window.Chux.getUser = function() {
        var $user   = $(".profile-navigation");
        if(!$user.length) return false;
        var image   = $(".user-picture", $user).css("background-image");
        var name    = $("h3", $user).text();
        return {
            image   : image,
            name    : name
        };
    };

    window.Chux.getImageUser = function() {
        var $user   = $(".profile-navigation");
        if(!$user.length) return false;
        var image   = $("#avatar_user_send_message").val();
        var name    = $("h3", $user).text();
        return {
            image   : image,
            name    : name
        };
    };



    window.Chux.Utils.flashError = function (error) {
        $('.alert').remove();

        var alert = $('<div/>')
            .attr('class', 'alert alert-danger')
            .html(error.message)
            .prependTo($(this).find('.form.mini'));
    };

    window.Chux.Utils.flashErrorModal = function (message, location) {
        $('.alert').remove();

        var alert = $('<div/>')
            .attr('class', 'alert alert-danger')
            .html(message)
            .prependTo(location);
    };

    window.Chux.Utils.flashMessage = function (error) {

        $('.alert').remove();

        var alert = $('<div/>')
            .attr('class', 'alert alert-warning')
            .html(error)
            .prependTo($(this).closest('form'));
    };

    /**
     * Add to cart button
     */
    window.Chux.Utils.addToCart = function () {

        window.Chux.Utils.quantity = parseInt(window.Chux.Utils.quantity) + 1;

        window.Chux.Utils.updateCartCount();

    };

    /**
     * remove cart button
     */
    window.Chux.Utils.removeFromCart = function () {

        window.Chux.Utils.quantity = parseInt(window.Chux.Utils.quantity) - 1;

        window.Chux.Utils.quantity = window.Chux.Utils.quantity < 0 ? 0 : window.Chux.Utils.quantity;

        window.Chux.Utils.updateCartCount();
    };

    /**
     * Update number of item in carts (cart icon on header)
     */
    window.Chux.Utils.updateCartCount = function  () {

        var $cart = $('#btnCart');

        if (window.Chux.Utils.quantity == 0) {
            $cart.removeClass('full').find('.number').text('');
            return;
        }
        $cart.addClass('full').find('.number').text(window.Chux.Utils.quantity);
    };


    $(document).on('keypress', '[data-module="idonate.keypress"]', centralDispatcher)
        .on('click', '[data-module="idonate.click"]', centralDispatcher);

    function centralDispatcher(e) {

        if (e.type !== 'keypress') {
            e.preventDefault();
        }

        var action = $(this).attr('data-action');

        switch(action) {
            case 'searchWithinPage':
                searchWithinPage.call(this, e);
                break;
            case 'checkbox':
                handleCheckbox.call(this, e);
                break;
        }
    }

    function searchWithinPage(e) {
        if(e.which == 13) {

            var val = $(this).val();

            if (val) {
                var newUrl = Chux.Utils.updateQueryStringParameter(document.location.href, 'q', val);
                document.location.href = newUrl;
            }
        }
    }

    function handleCheckbox(e) {
        var $this = $(this),
            targetInput = $this.attr('data-target'),
            $targetInput = $this.closest('form').find('[name="' + targetInput + '"]');

        if($this.hasClass("checked")) {
            $this.removeClass("checked");
            if ($targetInput.length)
                $targetInput.val(0);
        } else {
            $this.addClass("checked");
            if ($targetInput.length)
                $targetInput.val(1);
        }
    }

    window.Chux.Utils.updateCartCount();

}(window, jQuery));
