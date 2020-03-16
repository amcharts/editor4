import React, { Component } from "react";

class Home extends Component {
  render() {
    return (
      <div className="hello">
        <h1>amCharts 4 Editor Usage Demos</h1>
        <p>This sample project demonstrates common scenarios for using amCharts 4 Editor in your CMS:</p>
        <ol>
          <li><b>New chart</b> &mdash; allow users to freely create a new chart from templates.</li>
          <li><b>Edit chart</b> &mdash; users can edit properties of the chart and its data but can't change its type/template.</li>
          <li><b>New chart from data</b> &mdash; users can create new charts based on supplied preset data.</li>
          <li><b>Edit chart type</b> &mdash; users can apply different templates to a previously created chart.</li>
          <li><b>Settings</b> &mdash; shows how to modify some of the Editor configuration settings.</li>
        </ol>
        <h2>Setting up your own app</h2>
        <p>Note that in addition to using the code in these demos you also need to setup your 
          build process to copy the Editor application files into your output destination.</p>
        <p>In this sample we simply added a script to <code>package.json</code> to copy it during build.</p>
      </div>
    );
  }
}

export default Home;