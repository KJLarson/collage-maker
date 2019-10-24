// function dragstart_handler(ev) {
//   console.log("dragStart");
//   // Change the source element's background color to signify drag has started
//   ev.currentTarget.style.border = "dashed";
//   // Add the id of the drag source element to the drag data payload so
//   // it is available when the drop event is fired
//   ev.dataTransfer.setData("text", ev.target.id);
//   // Tell the browser both copy and move are possible
//   ev.effectAllowed = "copyMove";
// }
// function dragover_handler(ev) {
//   console.log("dragOver");
//   // Change the target element's border to signify a drag over event
//   // has occurred
//   ev.currentTarget.style.background = "lightblue";
//   ev.preventDefault();
// }
// function drop_handler(ev) {
//   console.log("Drop");
//   ev.preventDefault();
//   // Get the id of drag source element (that was added to the drag data
//   // payload by the dragstart event handler)
//   var id = ev.dataTransfer.getData("text");
//   // Only Move the element if the source and destination ids are both "move"
//   // if (id == "src_move" && ev.target.id == "dest_move")
//   //   ev.target.appendChild(document.getElementById(id));
//   // Copy the element if the source and destination ids are both "copy"
//   // if (id == "src_copy" && ev.target.id == "dest_copy") {
//     var nodeCopy = document.getElementById(id).cloneNode(true);
//     nodeCopy.id = "newId";
//     ev.target.appendChild(nodeCopy);
//   // }
// }
// function dragend_handler(ev) {
//   console.log("dragEnd");
//   // Restore source's border
//   ev.target.style.border = "solid black";
//   // Remove all of the drag data
//   ev.dataTransfer.clearData();
// }

(function () {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

var imagesOnCanvas = [];

function renderScene() {
  requestAnimationFrame(renderScene);

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0,
    canvas.width,
    canvas.height
  );


  for (var x = 0, len = imagesOnCanvas.length; x < len; x++) {
    var obj = imagesOnCanvas[x];
    obj.context.drawImage(obj.image, obj.x, obj.y);

  }
}

requestAnimationFrame(renderScene);

window.addEventListener("load", function () {
  var canvas = document.getElementById('canvas');
  canvas.onmousedown = function (e) {
    var downX = e.offsetX,
      downY = e.offsetY;

    // scan images on canvas to determin if event hit an object
    for (var x = 0, len = imagesOnCanvas.length; x < len; x++) {
      var obj = imagesOnCanvas[x];
      if (!isPointInRange(downX, downY, obj)) {
        continue;
      }

      startMove(obj, downX, downY);
      break;
    }

  }
}, false);

function startMove(obj, downX, downY) {
  var canvas = document.getElementById('canvas');

  var origX = obj.x,
    origY = obj.y;
  canvas.onmousemove = function (e) {
    var moveX = e.offsetX,
      moveY = e.offsetY;
    var diffX = moveX - downX,
      diffY = moveY - downY;


    obj.x = origX + diffX;
    obj.y = origY + diffY;
  }

  canvas.onmouseup = function () {
    // stop moving
    canvas.onmousemove = function () {};
  }
}

function isPointInRange(x, y, obj) {
  return !(x < obj.x ||
    x > obj.x + obj.width ||
    y < obj.y ||
    y > obj.y + obj.height);
}


function allowDrop(e) {
  e.preventDefault();
}

function drag(e) {
  //store the position of the mouse relativly to the image position
  e.dataTransfer.setData("mouse_position_x", e.clientX - e.target.offsetLeft);
  e.dataTransfer.setData("mouse_position_y", e.clientY - e.target.offsetTop);

  e.dataTransfer.setData("image_id", e.target.id);
}

function drop(e) {
  e.preventDefault();
  var image = document.getElementById(e.dataTransfer.getData("image_id"));

  var mouse_position_x = e.dataTransfer.getData("mouse_position_x");
  var mouse_position_y = e.dataTransfer.getData("mouse_position_y");

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  imagesOnCanvas.push({
    context: ctx,
    image: image,
    x: e.clientX - canvas.offsetLeft - mouse_position_x,
    y: e.clientY - canvas.offsetTop - mouse_position_y,
    width: image.offsetWidth,
    height: image.offsetHeight
  });

}

function convertCanvasToImage() {
  var canvas = document.getElementById('canvas');

  var image_src = canvas.toDataURL("image/png");
  window.open(image_src);

}