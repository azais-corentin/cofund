# Guide for working on issues

1. Create and switch to a new branch for the issue:
   ```shell
   mise issue:dev <ISSUE_NUMBER>
   ```

2. Make and commit your changes
3. Create the pull request:

   ```shell
   mise pr:new
   ```

4. After the pull request is reviewed and approved, merge it using:

   ```shell
   mise pr:merge
   ```
   This command squash merges the pull request and deletes the branch, then prunes the local branches.
