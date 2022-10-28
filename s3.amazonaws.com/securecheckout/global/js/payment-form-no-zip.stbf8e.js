function tokenizeCard() {

    if(validateCreditCardForm()) {

      var creditCardData = parseCreditCardForm();

      $('#credit-card-form input:submit').attr("disabled", "disabled");
      $('#credit-card-form input:submit').val("SAVING CARD...");

      Stripe.setPublishableKey('pk_live_5zI2pqlr69qMbV2WOOOdR0Al00LPTaFHmg');
      Stripe.card.createToken(creditCardData, stripeResponseHandler);
    }

    return false;
}

function validateCreditCardForm() {

    $('#credit-card-form').find('.error').removeClass('error');
    $('#please-complete').hide();

    var required = ['first_name', 'last_name', 'credit_number', 'credit_expires_month', 'credit_expires_year', 'credit_code', 'address'];
    var flag = false;

    $.each(required, function(key, id){
      if(!$('#credit-card-form #' + id).val()) {
        $(' #credit-card-form #' + id).parents('.control-group').addClass('error');
        flag = true;
      }
    });

    if(flag) {
      $('#please-complete').show();
      return false;
    }

    return true;
}

function parseCreditCardForm() {

    return {
        number: $('#credit-card-form #credit_number').val(),
        exp_month: $('#credit-card-form #credit_expires_month').val(),
        exp_year: $('#credit-card-form #credit_expires_year').val(),
        cvc: $('#credit-card-form #credit_code').val(),
        name: $('#credit-card-form #first_name').val() + ' ' + $('#credit-card-form #last_name').val(),
        address_line1: $('#credit-card-form #address').val(),
        address_line2: $('#credit-card-form #address_2').val(),
        address_city: $('#credit-card-form #city').val(),
        address_state: $('#credit-card-form #state').val(),
        address_zip: $('#credit-card-form #zip').val()
    };
}

function stripeResponseHandler(status, response) {

  var $form = $("#credit-card-form");

    //console.log(response);

    if (response.error) {
      
      // Show the errors on the form
      alert(response.error.message);

      // Reneable Form
      $form.find('input:submit').prop('disabled', false);
      $form.find('input:submit').val('SAVE');
    } else {
      
      var token = response.id;
      var card_type = response.card.brand;

      $form.append($('<input type="hidden" name="data[card_token]" />').val(token));
      $form.append($('<input type="hidden" name="data[credit_type]" />').val(card_type));

      if(!$('#anpass').val()) {
        $('#credit_number').val(response.card.last4);
        $('#credit_code').val('');
      }

      // and submit
      $form.get(0).submit();
    }
}