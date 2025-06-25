#!/usr/bin/emacs --script

(with-temp-buffer
  (save-excursion
    (insert-file-contents "../resources/jawiki-20250620-all-titles"))
  (kill-whole-line)
  (save-excursion
    (search-forward-regexp "^[^0]")
    (delete-region (point-at-bol) (point-max)))
  (save-excursion
    (replace-regexp "_([^)]*)$" ""))
  (save-excursion
    (replace-regexp "_" " "))
  (save-excursion
    (replace-regexp "^0\t" ""))
  (delete-duplicate-lines (point-min) (point-max))
  (write-file "./jawiki-all-titles-formatted"))
