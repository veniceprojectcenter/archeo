(function($){
  // $( document ).ready(function() {
  $(function(){
      //Initialize firebase
      var config = {
        apiKey: "AIzaSyAayzA-CyhlQFfs02PadKScL9FJEIwbqmQ",
        authDomain: "ve16archeo-prototypedatabase.firebaseapp.com",
        databaseURL: "https://ve16archeo-prototypedatabase.firebaseio.com",
        storageBucket: "ve16archeo-prototypedatabase.appspot.com",
        //messagingSenderId: "979534883195"
      };
      firebase.initializeApp(config);
      
      var curUser = firebase.auth().currentUser;
      $('#loading_div').hide();
      if (curUser) {
        $('#main_app_div').show();
      } else {
        $('#login_form_div').show();
      }
      
      $('#login_form').on("submit", function(e) {
        e.preventDefault();
        var email = $('#txtEmail').val(),
            pass = $('#txtPassword').val();
        firebase.auth().signInWithEmailAndPassword(email, pass)
          .then(function() {
            alert("Auth OK");
            $('#login_form_div').hide();
            $('#main_app_div').show();
          })
          .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            alert("Auth KO " + errorMessage);
          });
      });
  })
});
