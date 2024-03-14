function myFunction() {
    var x = document.getElementById("small-screens");
    if (x.className === "small-screens") {
      x.className += " responsive";
    } else {
      x.className = "small-screens";
    }
  }