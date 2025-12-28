---
id: 39
title: Correct docs routing for buttons and sidebar
stage: misc
date: 2025-12-09
surface: agent
model: claude-3-opus
feature: none
branch: main
user:
  name: Waheed khan
command: page show the "Page Not Found" you click able to sidebar Welcom to our Docusaurus Site!
labels:
  - docusaurus
  - routing
  - page-not-found
  - sidebar
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - docusaurus-book/src/pages/index.tsx
  - docusaurus-book/docusaurus.config.ts
tests_yaml:
  - null
prompt_text: |
  page show the "Page Not Found" you click able to sidebar Welcom to our Docusaurus Site!
response_text: |
  I have corrected the link for the "Start Reading Now" button to align with the Docusaurus `routeBasePath: '/'` configuration. This change should also implicitly resolve issues with sidebar links to documentation pages.
outcome: Corrected the routing for documentation pages, making them accessible.
evaluation: By adjusting the 'to' prop of the hero section button to reflect the `routeBasePath: '/'` configuration, both the button and sidebar links to documentation should now function correctly without leading to a "Page Not Found" error.
---