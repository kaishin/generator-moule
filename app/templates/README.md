# <%= projectName %>

<%= projectDescription %>

## Setup

Make sure you have `npm` and `bundler` installed, then run:

~~~shell
npm install
bundle install
npm install -g gulp
~~~

## Workflow

To run locally:

~~~shell
gulp
~~~

To build the site:

~~~shell
gulp build
~~~

<% if (hasBlog) { %>
You can generate a new post using:

~~~shell
gulp post -t "Some title"
~~~
<% } %>
