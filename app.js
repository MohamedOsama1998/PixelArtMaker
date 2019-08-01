const pixelCanvas = $("#pixel_canvas");
const options = $("#options");
const colorPicker = $("#colorPicker");
const height = $("#input_height");
const width = $("#input_width");
var x, y;
// States
var painting = false;
var erasing = false;

// converting RGBA to HEX
function rgbaToHex(color) {
  let values = "";
  // collect RR , GG , BB in a variable values
  for (let i = 0; i < color.length; i++) {
    if (!isNaN(parseInt(color[i])) || color[i] == ",") {
      values += color[i];
    }
  }
  // creat a list [ rr , gg , bb ]
  values = values.split(",");
  // Converting decimal --> Hexa
  for (let j = 0; j < values.length; j++) {
    values[j] = Number(values[j]).toString(16);
    // Making sure that every number has 2 digits
    if (values[j].length < 2) {
      values[j] = "0" + values[j];
    }
  }
  // return #rrggbb in Hexadecimal
  return "#" + values[0] + values[1] + values[2];
}

// Build grid function
function makeGrid() {
  // get height
  y = height.val();
  // get width
  x = width.val();
  // building grid
  for (let m = 0; m < y; m++) {
    pixelCanvas.append("<tr></tr>");
    for (let n = 0; n < x; n++) {
      $("tr")
        .last()
        .append("<td></td>");
    }
  }
}

// On submission
$("#sizePicker").submit(function(evt) {
  evt.preventDefault();
  // enable table for drawing
  pixelCanvas.css(
    "cursor",
    "url(http://www.rw-designer.com/cursor-extern.php?id=12350), auto"
  );
  pixelCanvas.css("pointer-events", "");
  // Clear table from already existing cells
  pixelCanvas.empty();
  // Build grid
  makeGrid();
  $("html, body").animate(
    {
      scrollTop: $("#canvas").offset().top
    },
    1000
  );
  // Enable options buttons
  options.children().removeAttr("disabled");
  options.children().css("cursor", "pointer");
});

// Painting/erasing while holding:
pixelCanvas.on("mouseenter", "td", function(evt) {
  if (painting) {
    $(this).css("background-color", colorPicker.val());
  }
  if (erasing) {
    $(this).css("background-color", "");
  }
});

// Managing mouse clicks:
pixelCanvas.on("mousedown", "td", function(evt) {
  evt.preventDefault();
  switch (evt.button) {
    // when holding Left-click --> painting
    case 0:
      if (evt.shiftKey) {
        pixelCanvas.css("cursor", "pointer");
        colorPicker.val(rgbaToHex($(evt.target).css("background-color")));
      } else {
        painting = true;
        erasing = false;
      }
      break;
    // when holding Right-click --> erasing
    case 2:
      pixelCanvas.css(
        "cursor",
        "url(http://www.rw-designer.com/cursor-extern.php?id=72976), auto"
      );
      painting = false;
      erasing = true;
      break;
  }
  if (painting) {
    $(this).css("background-color", colorPicker.val());
  } else if (erasing) {
    $(this).css("background-color", "");
  }
});

// reseting after releasing mouse
pixelCanvas.on("mouseup", "td", function() {
  painting = false;
  erasing = false;
  pixelCanvas.css(
    "cursor",
    "url(http://www.rw-designer.com/cursor-extern.php?id=12350), auto"
  );
});

// Disable right click action
pixelCanvas.contextmenu(function(evt) {
  evt.preventDefault();
});

// Clear canvas button function
$("#clear").click(function() {
  $("td").each(function() {
    $(this).css("background-color", "");
  });
});

// Done button function
$("#done").click(function() {
  $("td").each(function() {
    $(this).css("border", "1px solid " + $(this).css("background-color"));
  });
  $("tr").each(function() {
    $(this).css("border", "none");
  });
  pixelCanvas.css("pointer-events", "none");
  options.children().attr("disabled", "disabled");
  options.children().css("cursor", "not-allowed");
});

// Add column
$("#addCol").click(function() {
  if (x < 50) {
    width.val(++x);
    $("tr").each(function() {
      $(this).append("<td></td>");
    });
  }
});

// Remove column
$("#remCol").click(function() {
  if (x > 1) {
    width.val(--x);
    $("tr").each(function() {
      $(this)
        .children()
        .last()
        .remove();
    });
  }
});

// Add Raw
$("#addRaw").click(function() {
  if (y < 50) {
    height.val(++y);
    pixelCanvas.append("<tr></tr>");
    for (let i = 0; i < x; i++) {
      $("tr")
        .last()
        .append("<td></td>");
    }
  }
});

// Remove Raw
$("#remRaw").click(function() {
  if (y > 1) {
    height.val(--y);
    $("tr")
      .last()
      .remove();
  }
});
