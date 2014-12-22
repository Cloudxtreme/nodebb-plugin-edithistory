(function() {

  var EditHist = {};

  EditHist.curModal = null;
  EditHist.storedChanges = null;
  EditHist.displayCount = null;

  // cb for when it finishes loading.
  EditHist.goModal = function(cb) {
    // Create the modal
    // Socket req offset 0
    // render first sidebyside([0] vs [1]), then [1]vs[2] then [2]vs[3]...
  };

  EditHist.doneModal = function() {
    // Destruct the modal.
  };

  // Render the three sections for left/diff/right
  EditHist.renderSideBySide = function(parent, changeOffset) {
    // render changeOffset vs changeOffset+1
  };

  // Takes a changeobj and renders to a DOM element.
  EditHist.renderChanges = function(changes, target) {
    // target.append(builtDOM)
  };

  // outelem to stick the html in, cb for diff finished
  EditHist.goDiff = function(outElem, inA, inB, cb) {
    // Compute the diff
      // Render it to outElem
  };

  EditHist.onClickView = function() {
    // Do the modal
    EditHist.goModal(function() {

      // Darken/overlay a loading circle over the diff result.

      var diffList = [];

      $.each($(EditHist.curModal).children(".postData"), function(idx, elem) {
        diffList.push($(elem).text());
      });

      goDiff($(".diffResult"), diffList[0], diffList[1], function() {
        // remove the darken/overlay
      });
    });
  };

  EditHist.onClickClose = function() {
    EditHist.doneModal();
  };

  // Load next edit diff?
  EditHist.onLoadNew = function() {
    // Add a row
    displayCount += 1;
    var newRow = $("");
    EditHist.renderSideBySide(newRow, displayCount);
  };

})();
