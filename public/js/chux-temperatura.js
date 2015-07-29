

Chux.login = (function($, Chux, UI) {

    return {
        init: init
    }

    function init() {
        $(document).on('click', '[data-module="login.click"]', dispatcher)
            .on('click', '[data-model="checkbox.click"]', dispatcher);


        $('.container.profile').find('form').each(function() {
            Chux.Utils.ajaxify($(this), onUpdateSuccess, onUpdateError);
        });

        drawCharts();
    }

    function drawCharts() {

        //LINE chart
        $.getJSON('/ajax/charity/line-chart')
            .done(function(data) {
                var lineChartData = {
                    labels: data.labels,
                    datasets: [
                        {
                            label: "income last 12 months",
                            fillColor: "transparent",
                            strokeColor: "#2795EA",
                            pointColor: "#2795EA",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(220,220,220,1)",
                            data: data.data
                        }
                    ]
                };
                var lineChartCtx = document.getElementById("line-chart").getContext("2d");
                var lineChart = new Chart(lineChartCtx).Line(lineChartData, {
                    bezierCurve: false,
                    scaleShowGridLines: true,
                    scaleShowHorizontalLines: true,
                    scaleShowVerticalLines: false
                });
            })


    }

    function dispatcher(e) {
        e.preventDefault();

        var action = $(this).attr('data-action');

        switch(action) {
            case 'addAttribute':
                addAttribute.call(this, e);
                break;
            case 'changeCheckbox':
                toggleCheckbox.call(this, e);
                break;
            case 'addManager':
                addManager.call(this, e);
                break;
            case 'removeManagerSubmit':
                removeManagerSubmit.call(this, e);
                break;
            case 'editProfileSection':
                editProfileSection.call(this, e);
                break;
            case 'closeProfileSection':
                closeProfileSection.call(this, e);
                break;
            case 'saveNewOrganization':
                saveNewOrganization.call(this,e);
                break;
            case 'save':
                var $this = $(this);
                var buttonSave = $this;
                var divSave = buttonSave;
                divSave = $(divSave).closest('form').find('div.alert').find('ul');
                divSave.empty();
                $this.closest('form').submit();
                break;
        }
    }

    function editProfileSection(e) {
        var $this = $(this);
        var $section = $this.closest(".summary");
        var $profileSection = $section.closest(".profile-section");
        $(".details", $section).addClass("inactive");
        $(".form", $section).addClass("active");
        $(":input:first", $profileSection).focus();
        var top = parseInt($profileSection.position().top);
        $.scrollTo($profileSection, 200);
    };

    function removeManagerSubmit() {
        var $this = $(this),
            id = $this.attr('data-id-manager');

        $.get('/ajax/manager/users/remove?id='+id).success(function(e) {
            if(e.hasOwnProperty('error')){
                UI.notify(e.result.message, 3000);
            }
            else {
                $this.parents('.summary').css('display', 'none');
                UI.notify("Access removed from organization.", 3000);
            }
        }).error(function() {
            var error = {message: "There has been an error while trying to remove the product from the Manager. Please try again."};
            UI.notify(error.message, 3000);
        });
    }

    function uploadSuccess(data, textStatus, jqXHR) {

        if ('error' in data)
            UI.notify("There was an error while trying to upload the file", 3000);
        else {
            // Create input with that for the POST
            element = '<input type="hidden" id="files[]" name="files[]" value="' + data['id'] + '">';
            $('form').append(element);
        }

    }

    function addManager(){
        var user_id = $(this).attr("data-org-id");
        UI.modal({
            width   : "600px",
            url     : "/ajax/tpl/add-manager?org_id="+org_id,
            onLoad: function() {
                Chux.Utils.ajaxify($(this).find('form'), onModalSuccess, onModalError);
            }
        });
    }

    function closeProfileSection(e) {
        var $this = $(this);
        var $section = $this.closest(".summary");
        $(".details", $section).removeClass("inactive");
        $(".form", $section).removeClass("active");
    };

    function onModalSuccess(e) {
        if(e.error) {
            $('#error').html(e.error);
            for (var key in e.error.message) {
                if (e.error.message.hasOwnProperty(key)) {
                    for (var key1 in e.error.message[key]) {
                        if (e.error.message[key].hasOwnProperty(key1)) {
                            $('#error').html( e.error.message[key][key1]);
                            break;
                        }
                    }
                }
            }
            $('#error').css('display','block');
        }else{
            // var email = $('#email_user').val();
            UI.modal('close')
            window.location.reload();
        }
    }

    function onModalError() {

    }

    function saveNewOrganization(){

        var $this = $(this);
        var data = $('[name="addNameOrganizationForm"]').serialize();
        var name = data['org_name'];

        $.get('/ajax/organization/create?name='+name).success(function(response) {
            if(response.hasOwnProperty('error')){
                UI.notify(response.error.message[0], 3000);
            }
            else {
                $this.closest('.summary').find('.details .text').html(name);
                $this.parents('.summary').find('.details').removeClass('inactive');
                $this.parents('.summary').find('.form').removeClass('active');
                $this.parents('.form-control').html('<a data-module="profile.click" data-action="closeProfileSection" class="cancel">cancel</a>');

                $('[name="org_id"]').val(response.org["id"]);
                $('[name="org_name"]').val(response.org["name"]);
                $.each(response.type_id, function(key, value) {$('[name="organization_type_id"]').append('<option value="'+key+'">'+value+'</option>'); });
                $.each(response.status,function(key, value) { $('[name="organization_status_id"]').append('<option value="'+key+'">'+value+'</option>'); });

                $.each(response.causes,function(key, value) {
                    $('#causes').append('<li><input type="hidden" name="causes['+value["id"]+']" data-associate-with="cause['+value["id"]+']"><a id="cause['+value["id"]+']" val="'+value["id"]+'" class="checkbox" action="checkbox" data-model="checkbox.click" data-action="changeCheckbox">'+value["name"]+'</a></li>');
                });


                //UI.notify("Access removed from organization.", 3000);
            }
        }).error(function() {
            var error = {message: "There has been an error while trying to remove the product from the Manager. Please try again."};
            UI.notify(error.message, 3000);
        });
    }




    function onUpdateSuccess(e) {
        var $this = $(this),
            formName = $this.attr('name');

        switch(formName) {

            case 'managerForm':
                console.log(e);
                if(e.error){
                    UI.notify(e.error, 20000);
                    for (var key in e.error.message) {
                        if (e.error.message.hasOwnProperty(key)) {
                            for (var key1 in e.error.message[key]) {
                                if (e.error.message[key].hasOwnProperty(key1)) {
                                    UI.notify( e.error.message[key][key1], 20000);
                                }
                            }
                        }
                    }
                    $(alertSection).show();
                    break;
                }else {
                    var email = this.elements.email.value;
                    var role = $('#role').val();
                    var managerString = email + '<br/>' + role;
                    $this.closest('.summary').find('.details .text').html(managerString);
                    console.log(e);
                    closeProfileSection.call(this);
                    break;
                }
            case 'updateManagerForm' :

                if(e.hasOwnProperty('error')){
                    console.log(e.error);
                    var alertSection = $(buttonSave).closest('form').find('div.alert');
                    break;
                }else {
                    console.log('aca');
                    closeProfileSection.call(this);
                    window.location.reload();
                    break;
                }

            case 'nameOrganizationForm':
                if(e.error){
                    var alertSection = $(buttonSave).closest('form').find('div.alert');
                    for (var key in e.error.message) {
                        if (e.error.message.hasOwnProperty(key)) {
                            for (var key1 in e.error.message[key]) {
                                if (e.error.message[key].hasOwnProperty(key1)) {
                                    $(alertSection).find('ul').append("<li>" + e.error.message[key][key1] + "</li>");
                                }
                            }
                        }
                    }
                    $(alertSection).show();
                    break;
                }else{
                    var org_name = this.elements.org_name.value;
                    $this.closest('.summary').find('.details .text').text(org_name);
                    $.get('/ajax/vanity/' + org_name).success(function(e) {
                        var profile_vanity = e[0].slugify;
                        $('#profile_vanity_url_text').text(profile_vanity);
                    });
                    closeProfileSection.call(this);
                    break;
                }

            case 'statusOrganizationForm':
                var percentage = this.elements.percentage.value;
                var type_name = $( "#organization_type_name option:selected" ).text();
                var status_name = $( "#organization_status_name option:selected" ).text();
                $this.closest('.summary').find('.details .text').html('Percentage: '+percentage+ ' % </br> Organization Type: '+ type_name + '</br> Status: '+status_name);
                /*$.get('/ajax/vanity/' + org_name).success(function(e) {
                 var profile_vanity = e[0].slugify;
                 $('#profile_vanity_url_text').text(profile_vanity);
                 });*/
                closeProfileSection.call(this);
                break;

            case 'impactForm':
                if(e.error){
                    var alertSection = $(buttonSave).closest('form').find('div.alert');
                    for (var key in e.error.message) {
                        if (e.error.message.hasOwnProperty(key)) {
                            for (var key1 in e.error.message[key]) {
                                if (e.error.message[key].hasOwnProperty(key1)) {
                                    $(alertSection).find('ul').append("<li>" + e.error.message[key][key1] + "</li>");
                                }
                            }
                        }
                    }
                    $(alertSection).show();
                    break;
                }else{
                    console.log(e);
                    var factor = this.elements.factor.value;
                    var impact_singular = this.elements.impact_singular.value;
                    var impact_plural = this.elements.impact_plural.value;

                    $this.closest('.summary').find('.details .text').text(factor + ' ' + impact_singular+'/'+impact_plural);
                    closeProfileSection.call(this);
                    break;
                }

            case 'websiteOrganizationForm':
                if(e.error){
                    var alertSection = $(buttonSave).closest('form').find('div.alert');
                    for (var key in e.error.message) {
                        if (e.error.message.hasOwnProperty(key)) {
                            for (var key1 in e.error.message[key]) {
                                if (e.error.message[key].hasOwnProperty(key1)) {
                                    $(alertSection).find('ul').append("<li>" + e.error.message[key][key1] + "</li>");
                                }
                            }
                        }
                    }
                    $(alertSection).show();
                    break;
                }else{
                    var org_website = this.elements.org_website.value;

                    $this.closest('.summary').find('.details .text').text(org_website);
                    closeProfileSection.call(this);
                    break;
                }

            case 'causesOrganizationForm':
                if(e.error){
                    var alertSection = $(buttonSave).closest('form').find('div.alert');
                    for (var key in e.error.message) {
                        if (e.error.message.hasOwnProperty(key)) {
                            for (var key1 in e.error.message[key]) {
                                if (e.error.message[key].hasOwnProperty(key1)) {
                                    $(alertSection).find('ul').append("<li>" + e.error.message[key][key1] + "</li>");
                                }
                            }
                        }
                    }
                    $(alertSection).show();
                    break;
                }else{
                    $this = $(this);
                    a = $($('#causes li').find('a'));

                    $this.closest('.summary').find('.details .text').html('');
                    $.each(a, function(){
                        if($(this).hasClass("checked").toString() == 'true'){
                            $this.closest('.summary').find('.details .text').append($(this).text() + '</br>');
                        }
                    });
                    closeProfileSection.call(this);
                    break;
                }
            case 'addCausesOrganizationForm':
                $this = $(this);
                a = $($('#causes li').find('a'));

                $this.closest('.summary').find('.details .text').html('');
                $.each(a, function(){
                    if($(this).hasClass("checked").toString() == 'true'){
                        $this.closest('.summary').find('.details .text').append($(this).text() + '</br>');
                    }
                });
                closeProfileSection.call(this);
                break;

            case 'addNameOrganizationForm':
                if(e.error){
                    console.log(e);
                    break;
                }else{
                    closeProfileSection.call(this);
                    break;
                }

        }
    }

    function  onUpdateError(){

    }

    function uploadComplete(jqXHR, textStatus) {}
    function uploadUnsupported(message) {}
    function uploadOversized(message) {}
    function uploadError(jqXHR, textStatus, errorThrow) {}
    function uploadProgress(percent) {}
    function uploadPreview(image) {
        // Get each .thumb within the context of the file uploader
        $(".thumb", this).each(function(){
            var $this = $(this);
            var hasThumb = $this.data("thumb");
            if(!hasThumb) {
                var styles = {backgroundImage: "url(" + image + ")"};
                $this.css(styles);
                $this.data("thumb", true);
                return false;
            }
        });
    }

    function toggleCheckbox(e) {

        var $this = $(this),
            checkBoxId = $this.attr('id');
        var variable = $('[data-associate-with="' + checkBoxId + '"]');

        var str = checkBoxId.substring(6, checkBoxId.length - 1);

        if (variable.val() == 0) {
            $('[val="' + str + '"]').addClass('checked');
            $('[data-associate-with="' + checkBoxId + '"]').val(1);
        } else {
            $('[val="' + str + '"]').removeClass('checked');
            $('[data-associate-with="' + checkBoxId + '"]').val(0);
        }
    }

}(jQuery, Chux, UI))
