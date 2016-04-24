$(document).ready(function(){
  console.log("JQuery loaded and DOM ready!");

  // set up AJAX request on click event of delete button
  $('.delete-link').on('click', function(event){
    event.preventDefault(); // stops link from refreshing the page
    var destroyRoute = $(this).attr('href');
    var deleteBtn = $(this); // cache the DOM lookup for the delete button
    $.ajax({
      method: 'DELETE',
      url: destroyRoute
    }).done(function(){
      // do stuff when done
      console.log('A post was deleted');
      deleteBtn.closest('li').fadeOut('slow',function(){
        $(this).remove();
      });
    });
  });

  $('.put-form').on('submit', function(event){
    event.preventDefault();
    var updateRoute = $(this).attr('action');
    var updateData = $(this).serialize();
    $.ajax({
      method: 'PUT',
      url: updateRoute,
      data: updateData
    }).done(function(data){
      location.href="/posts";
    })
  });
});