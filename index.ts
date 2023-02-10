import * as Y from "yjs";

function setupTests() {
  const originalDocument = new Y.Doc();
  originalDocument.getArray().insert(0, ["Heading"]);
  originalDocument.getArray().insert(1, ["First Paragraph"]);
  originalDocument.getArray().insert(2, ["Second Paragraph"]);

  const rChangesDocument = new Y.Doc();
  Y.applyUpdate(rChangesDocument, Y.encodeStateAsUpdate(originalDocument));

  const hChangesDocumnet = new Y.Doc();
  Y.applyUpdate(hChangesDocumnet, Y.encodeStateAsUpdate(originalDocument));

  return {
    D: originalDocument,
    R: rChangesDocument,
    H: hChangesDocumnet,
  };
}

function applyUpdatesAndLog(D: Y.Doc, R: Y.Doc, H: Y.Doc) {
  Y.applyUpdate(D, Y.encodeStateAsUpdate(R));

  console.log("D + R = D'");
  console.log(D.getArray().toArray());

  Y.applyUpdate(D, Y.encodeStateAsUpdate(H));

  console.log("D' + H = D''");
  console.log(D.getArray().toArray());
}

// Case 1.1
// R adds something to D
// H adds something to D
function TestOne() {
  console.log("==================================");
  console.log("==========TEST ONE================");
  const { D, R, H } = setupTests();

  R.getArray().insert(3, ["Third Paragraph"]);

  H.getArray().insert(3, ["Different Third Paragraph"]);

  applyUpdatesAndLog(D, R, H);
}

// Case 1.2
// R adds something to D
// H removes something from D
function TestTwo() {
  console.log("==================================");
  console.log("==========TEST TWO================");

  const { D, R, H } = setupTests();

  R.getArray().insert(3, ["Third Paragraph"]);

  // Delete "Second Paragraph"
  H.getArray().delete(2, 1);

  applyUpdatesAndLog(D, R, H);
}

// Case 1.3
// R adds something to D
// H edits something from D
function TestThree() {
  console.log("==================================");
  console.log("==========TEST THREE================");

  const { D, R, H } = setupTests();
  R.getArray().insert(3, ["Third Paragraph"]);

  // Update "Second Paragraph"
  H.getArray().delete(2, 1);
  H.getArray().insert(2, ["Updated Second Paragraph"]);

  applyUpdatesAndLog(D, R, H);
}

// Case 2.1
// R removes something from D
// H adds something to D
function TestFour() {
  console.log("==================================");
  console.log("==========TEST FOUR================");

  const { D, R, H } = setupTests();

  // R deletes 'Second Paragraph'
  R.getArray().delete(2, 1);

  H.getArray().insert(3, ["Third Paragraph"]);

  applyUpdatesAndLog(D, R, H);
}

// Case 2.2.1
// R removes something from D
// H removes the same thing from D
function TestFive() {
  console.log("==================================");
  console.log("==========TEST FIVE================");

  const { D, R, H } = setupTests();

  // R and H both delete 'Second Paragraph'
  R.getArray().delete(2, 1);
  H.getArray().delete(2, 1);

  applyUpdatesAndLog(D, R, H);
}

// Case 2.2.2
// R removes something from D
// H removes somthing else from D
function TestSix() {
  console.log("==================================");
  console.log("==========TEST SIX================");

  const { D, R, H } = setupTests();

  // R  delete 'Second Paragraph'
  R.getArray().delete(2, 1);

  // R  delete 'First Paragraph'
  H.getArray().delete(1, 1);

  applyUpdatesAndLog(D, R, H);
}

// Case 2.3.1
// R removes something from D
// H edits the same thing from D
function TestSeven() {
  console.log("==================================");
  console.log("==========TEST SEVEN================");

  const { D, R, H } = setupTests();

  // R  delete 'Second Paragraph'
  R.getArray().delete(2, 1);

  // H  edits 'Second Paragraph'
  H.getArray().delete(2, 1);
  H.getArray().insert(2, ["Updated second paragraph"]);

  applyUpdatesAndLog(D, R, H);
}

// Case 2.3.2
// R removes something from D
// H edits something else from D
function TestEight() {
  console.log("==================================");
  console.log("==========TEST EiGHT================");

  const { D, R, H } = setupTests();

  // R  delete 'Second Paragraph'
  R.getArray().delete(2, 1);

  // H  edits 'First Paragraph'
  H.getArray().delete(1, 1);
  H.getArray().insert(1, ["Updated First paragraph"]);

  applyUpdatesAndLog(D, R, H);
}

// Case 3.1
// R edits something in D
// H adds something to D
function TestNine() {
  console.log("==================================");
  console.log("==========TEST NINE================");

  const { D, R, H } = setupTests();

  // R  edits 'Second Paragraph'
  R.getArray().delete(2, 1);
  R.getArray().insert(2, ["Updated second paragraph"]);

  // H adds 'Third Paragraph'
  H.getArray().insert(3, ["Third paragraph"]);

  applyUpdatesAndLog(D, R, H);
}

// Case 3.2.1
// R edits something in D
// H removes that same thing from D
function TestTen() {
  console.log("==================================");
  console.log("==========TEST TEN================");

  const { D, R, H } = setupTests();

  // R  edits 'Second Paragraph'
  R.getArray().delete(2, 1);
  R.getArray().insert(2, ["Updated second paragraph"]);

  // H revmoes second paragraph
  H.getArray().delete(2, 1);

  applyUpdatesAndLog(D, R, H);
}

// Case 3.2.2
// R edits something in D
// H removes something else from D
function TestEleven() {
  console.log("==================================");
  console.log("==========TEST ELEVEN================");

  const { D, R, H } = setupTests();

  // R  edits 'Second Paragraph'
  R.getArray().delete(2, 1);
  R.getArray().insert(2, ["Updated second paragraph"]);

  // H revmoes first paragraph
  H.getArray().delete(1, 1);

  applyUpdatesAndLog(D, R, H);
}

// Case 3.3.1
// R edits something in D
// H edits same thing in D
function TestTwelve() {
  console.log("==================================");
  console.log("==========TEST TWELVE================");

  const { D, R, H } = setupTests();

  // R  edits 'Second Paragraph'
  R.getArray().delete(2, 1);
  R.getArray().insert(2, ["Updated second paragraph"]);

  // apply R to H first here?
  // This is behaviour we can define
  // NOTE: Edge Case #1
  Y.applyUpdate(H, Y.encodeStateAsUpdate(R));

  // H edits Second paragraph
  H.getArray().delete(2, 1);
  H.getArray().insert(2, ["Another updated second paragraph"]);

  applyUpdatesAndLog(D, R, H);
}

// Case 3.3.2
// R edits something in D
// H edits something else in D
function TestThirteen() {
  console.log("==================================");
  console.log("==========TEST THIRTEEN================");

  const { D, R, H } = setupTests();

  // R  edits 'Second Paragraph'
  R.getArray().delete(2, 1);
  R.getArray().insert(2, ["Updated second paragraph"]);

  // H edits first paragraph
  H.getArray().delete(1, 1);
  H.getArray().insert(1, ["Updated first paragraph"]);

  applyUpdatesAndLog(D, R, H);
}

TestOne();
TestTwo();
TestThree();
TestFour();
TestFive();
TestSix();
TestSeven();
TestEight();
TestNine();
TestTen();
TestEleven();
TestTwelve();
TestThirteen();
