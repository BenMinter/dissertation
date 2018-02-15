<?php
  //create/open comments file
  $handle = fopen("../comments.txt", 'a') or die();
  //write comment to file.
  $comment = "\nComment Start: \n" . $_POST['comment'] . "\nComment End.\n";
  fwrite($handle,$comment);
  //close file
  fclose($handle);
?>
