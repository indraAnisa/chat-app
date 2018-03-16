$(document).ready(function() {
  $.get("/getRooms", function(rooms) {
    if (rooms) {
      rooms.forEach(room => {
        $("#roomlist").append("<option value='" + room + "'>");
      });
    }
  });
});
