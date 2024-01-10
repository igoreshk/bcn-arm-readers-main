# Code review

The code review helps colleagues improve their code, and gives you the opportunity to learn something new. Make code review into your daily practice.

**What to check when reviewing?**

## Readability

Variables and functions should have human-readable names that give an idea of what kind of entity it is and why it is needed. Each function should perform a clear task and not duplicate an existing one. If some piece of code is not clear, you can and should ask a question in the comments to MR. If you invest your time into reading someone else's code you should focus on other aspects as well, not just readability.

## Complitness

Check that the solution covers all requirements from the task.

## Hidden implications

You have the opportunity to see the code from a different angle, so try to identify any hidden consequences that might prevent your code from working properly.

## Tests

The inspection of test cases is also part of the review. Make sure to achieve good test coverage. More about this you can read here in [tests and typing](.\tests_and_typing).

If you can come up with better solutions or approaches, please do so. Code review sessions represent a great opportunity to share knowledge across the team. New or junior team members should perform code reviews too, it's a great chance for them to learn and to get involved in more complex tasks. The best readability inspection can be done by somebody who is not fully familiar with the code base. Usually, the teammates first checks the code, then mentors, and only after all discussions are closed, the merge request will be merged.

Don't forget to tag your colleagues and mentors to reviewe your code.
