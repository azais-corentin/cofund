# Guide for working on issues

1. Create and switch to a new branch for the issue:
   ```shell
   gh issue develop -c <ISSUE_NUMBER>
   ```

2. Make and commit your changes
3. Create the pull request:

   ```shell
   gh pr new
   ```
   > Note: This will also push your changes to the remote repository.

4. After the pull request is reviewed and approved, merge it using:

   ```shell
   gh pr merge -m -d -s
   ```
   This command merges the pull request and deletes the branch.
