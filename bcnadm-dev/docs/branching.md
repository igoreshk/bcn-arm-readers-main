# Branching Guide

---

## Working on your task

1. Pull the last changes from the `dev` branch of a remote repository to a local one.

2. Create a new branch from the `dev` branch, set the name in the format `TaskId_short_description`.
   Take the description from the JIRA ticket title, for example: `EPMLSTRBCN-2358_Refactor_beacons_controllers`.

3. Complete logical part of your task and carefully look at the files, which are included in the commit 
   (maybe some of them are redundant). Write a commit message in the format `TaskId: commit message` beginning 
   with **the base form of the verb** as if you continue the phrase "If it will be committed it will **\<your commit
   message\>**".
   For example, commit messages could be:
    - `EPMLSTRBCN-2358: move code to BeaconController`
    - `EPMLSTRBCN-2358: update tests in BeaconControllerTest`
   
   Don't forget to give as many details as possible in the commit message but **be concise and informative**. 
   Keep in mind that new developers on the project appear from time to time, and it helps to work with the project 
   easier.

4. If required, separate your commits logically when you work on the task (see **"Commit separation"** section).

5. Prepare your branch for pushing to the remote repository:

    - update your local `dev` from remote with
      > git pull origin dev

    - switch to your task branch, make a rebase on `dev` with
      > git rebase dev

      and resolve conflicts if necessary

    - build, run tests, start project, check that your changes work properly,
      and you didn't break something by accident.

6. Push your task branch to the remote repository with
   > git push -u origin **\<your task branch name\>**

7. Go to [GitLab](https://git.epam.com/epm-lstr/epm-lstr-bcn) and create merge request:
    - fill the **"Title"** field in format `TaskId [Component] task description` without underscore symbols,
      where Component = BE|FE|DevOps, BE - backend, FE - frontend, etc.
      For example: `EPMLSTRBCN-2358 [BE] Refactor beacons controllers`
    - fill **"Description"** field with a short overview of your work and add the link to the JIRA ticket
    - mention all relevant mentors in the **Description** field with prefix `@` before mentor's name to get
      them notified. For example: `@ivan_ivanov @ivan_petrov`
    - assign the merge request to a mentor in **"Assignee"** field only if your merge request
      **needs a specific reviewer**

8. Be prepared to take part in the code review process. Information about code review process can be found in
   [Code Review Guidelines](https://kb.epam.com/display/EJAVACC/Code+Review+Guidelines).

9. After finishing a task consider if it is useful to update or add new information to the
   [Knowledge Base](https://kb.epam.com/pages/viewpage.action?pageId=467207975).
   
10. If during your task implementation you've created several branches which have been pushed to remote repository,
    remove them from [GitLab: Repository -> Branches](https://git.epam.com/epm-lstr/epm-lstr-bcn/bcnadm/-/branches)
    when you finish your task.

---

## Commit separation

If the total amount of changes in your branch is below a reasonable threshold (100-200 lines), it is fine to
have a single commit in your branch. In this case, all changes requested during code review should be squashed
with that commit. You may still create several commits in your branch, but this is not required.

If this is not the case, then the commit separation is necessary. Commits should be split logically by type of work
or by logic units. Each commit should represent a complete part of work which **can be compiled and executed**.
The following examples will give you some hints on how to do that:
- extract refactoring to a separate commit
- separate test changes from main code changes
- group a lot of similar changes (like method renaming) together in a single commit
- unrelated changes in several modules can be divided into separate commits per each module
- different types of changes (like code and pipeline changes) can be separated

---

## Organizing your branch during code review rounds

During the code review a team member can add comments, and you may need to make changes in your code.
In the local task branch rewrite the code with the following steps:

1. If you have only one commit in your task branch, make changes in accordance with the team comment and
   add modified files to be committed and replace the last commit with
   > git add
   > 
   > git commit --amend

2. If you have several commits in your task branch, identify which changes should become a part which commit
   and create a _temporary commit_ for each such commit:
   > git add
   > 
   > git commit -m "temporary commit"
   
   Identify a commit which is logically relevant to your changes and edit the position of your temporary commit
   so that it can be squashed with chosen commit. See **"Interactive rebase example"** below for details.

3. Prepare your branch for pushing to the remote repository as described in item 5 in *"Working on your task"* section

4. **Force** push your task branch to the remote repository with
   > _git push -f_

For more information on how to restructure your branch see
[git documentation](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History).

___

## Interactive rebase example

Suppose you got a comment from the team to change the logic of `BeaconController`,
and your branch has the following history of commits:

```
EPMLSTRBCN-2358: delete empty lines
EPMLSTRBCN-2358: update tests in BeaconControllerTest
EPMLSTRBCN-2358: move code to BeaconController
```

To modify the content of first commit (`EPMLSTRBCN-2358: move code to BeaconController`) do the following:

1. Create temporary commit as described in **"Organizing your branch during code review rounds"** section.

   ```
   temporary commit
   EPMLSTRBCN-2358: delete empty lines
   EPMLSTRBCN-2358: update tests in BeaconControllerTest
   EPMLSTRBCN-2358: move code to BeaconController
   ```

2. Execute interactive rebase with
    > git rebase -i HEAD~X

    where X is a number of the last commits that you want to reorganise, in this case it is 4.

    The dialog opens with the commits in the reverse order:

    ```
    pick 321b588f2 EPMLSTRBCN-2358: move code to BeaconController 
    pick fc023a3f3 EPMLSTRBCN-2358: update tests in BeaconControllerTest
    pick d859b2b03 EPMLSTRBCN-2358: delete empty lines
    pick 3af95a136 temporary commit
    ```

3. Move the `temporary commit` and change action `pick` to `f` (f, fixup <commit> = like "squash", but discard
this commit's log message)

    ```
    pick 321b588f2 EPMLSTRBCN-2358: move code to BeaconController
    f 3af95a136 temporary commit
    pick fc023a3f3 EPMLSTRBCN-2358: update tests in BeaconControllerTest
    pick d859b2b03 EPMLSTRBCN-2358: delete empty lines
    ```

4. Save the changes and close the dialog, the `temporary commit` will be combined with the
`EPMLSTRBCN-2358: move code to BeaconController`.

Another way of achieving the same effect:

1. Execute interactive rebase with
   > git rebase -i HEAD~3
   
2. Change action `pick` to `e` (edit commit).

    ```
    e 321b588f2 EPMLSTRBCN-2358: move code to BeaconController 
    pick fc023a3f3 EPMLSTRBCN-2358: update tests in BeaconControllerTest
    pick d859b2b03 EPMLSTRBCN-2358: delete empty lines
    ```
3. The rebase will stop on first commit. Apply required changes and execute
   > git add .
   > 
   > git commit
    
   The changes will become a part of the commit.

___

## Resolving merge conflicts strategy

When you do the rebase of the task branch (see item 5 in **"Working on your task"**),
you should follow [the rules](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging)
during resolving merge conflicts:

1. Accept changes from `dev` by default.

2. In complicated cases find out the committer of the same chunk of the code by applying git blame feature
   (in IntelliJ IDEA right-click on the gutter and choose **"Annotate with Git Blame"**). Discuss the topic and
   go to conclusion what would be the final version.
