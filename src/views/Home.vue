<template>
  <div class="container">
    <div class="card border border-brand-secondary mb-5">
      <h1 class="card-header text-center"><i class="fa fa-user"></i> About Me</h1>
      <div class="card-body">
        <p>
          My name is Adrian Flannery. I am software developer based out of Birmingham, Alabama.
          This is a space where I hope to showcase some of my talents.
        </p>
      </div>
    </div>

    <div class="card border border-brand-secondary mb-5">
      <h1 class="card-header text-center"><i class="fa fa-chart-pie"></i> Metrics</h1>
      <div class="card-body">
        <div class="row">
          <div id="efficiency-gauge" class="gauge small-chart col-md-6"></div>
          <donut-chart class="small-chart col-md-6"
            :params="{
              'general': {
                'width': 500,
                'isPercent': true,
                'chartLabel': 'Outside Work',
              },
              'data': [
                {
                  'label':'Reading',
                  'value': 30,
                },
                {
                  'label':'Education',
                  'value': 10,
                },
                {
                  'label':'Coding',
                  'value': 25,
                },
                {
                  'label':'Netflix',
                  'value': 15,
                },
                {
                  'label':'Exercise',
                  'value': 20,
                }
              ]
            }"
          ></donut-chart>
        </div>
      </div>
    </div>

    <div class="card border border-brand-secondary mb-5">
      <h1 class="card-header text-center"><i class="fa fa-folder-open"></i> Project Snapshots</h1>
      <div class="card border border-brand-secondary mb-5">
        <div class="card-body">
          <div class="row">
            <div class="col-md-4">
              <a href="DNAAlignment/"><img class="featurette-image img-responsive center-block" src="images/DNAAlignmentXY_sample.jpg" alt="DNAAlignmentXY"></a>
            </div>
            <div class="col-md-8">
              <h2 class="featurette-heading"><a href="DNAAlignment/">DNA Alignment XY</a></h2>
                <p class="lead text-muted">
                  In 2014, researchers combined two artificial codons into the genetic code of a viable, self-replicating organism. This project takes the local
                  and global sequence alignment algorithms and adapts them to use separate scoring strategies for natural and artificial codons. Requires Silverlight.
                  <a href="DNAAlignment/" class="pull-right btn btn-default btn-md"><i class="fa fa-angle-double-right fa-lg"></i></a>
                </p>
            </div>
          </div>
          <hr class="featurette-divider">
          <div class="row">
            <div class="col-md-4">
              <a href="MinesweeperJS/"><img class="featurette-image img-responsive center-block" src="images/minesweeperjs_sample.jpg" alt="MinesweeperJS"></a>
            </div>
            <div class="col-md-8">
              <h2 class="featurette-heading"><a href="MinesweeperJS/">MinesweeperJS</a></h2>
              <p class="lead text-muted">
                An early iteration of a project to help illustrate patterns used in solving Minesweeper.
                <a href="MinesweeperJS/" class="pull-right btn btn-default btn-md"><i class="fa fa-angle-double-right fa-lg"></i></a>
              </p>
            </div>
          </div>
          <hr class="featurette-divider">
          <div class="row">
            <div class="col-md-4">
              <a href="SpectrumToRGB"><img class="featurette-image img-responsive center-block" src="images/SpectrumToRGB_sample.jpg" alt="SpectrumToRGB"></a>
            </div>
            <div class="col-md-8">
              <h2 class="featurette-heading"><a href="SpectrumToRGB/">SpectrumToRGB</a></h2>
              <p class="lead text-muted">
                Have you ever wondered what a pigment looks like if you purified a macroscopic amount? SpectrumToRGB takes an input absorbance or reflectance spectrum and approximates the color in RGB space.
                <a href="SpectrumToRGB/" class="pull-right btn btn-default btn-md"><i class="fa fa-angle-double-right fa-lg"></i></a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card border border-brand-secondary mb-5">
      <h1 class="card-header text-center"><i class="fa fa-folder-open"></i> Other Projects</h1>
        <div class="card-body">
          <div class="row">
            <div class="col-md-4">
              <a href="http://apps.cytoscape.org/apps/wkshelldecomposition" target="_blank"><img class="featurette-image img-responsive center-block" src="http://apps.cytoscape.org/media/wkshelldecomposition/screenshots/Example%20Network%20Layout.png" alt="wk Shell Decomposition"></a>
            </div>
            <div class="col-md-8">
              <h2 class="featurette-heading"><a href="http://apps.cytoscape.org/apps/wkshelldecomposition" target="_blank">wk Shell Decomposition</a></h2>
              <p class="lead text-muted">
                wk-shell-decomposition is a Cytoscape 3 app that performs a k-shell decomposition on a network using a weighted algorithm.
                k-shell decomposition is a method that ranks the most important nodes in a network and partitions them into shells based on that rank.
                The app also adjusts the layout of the network to packed concentric rings sorted by k-shell and applies a gradient to the color of the nodes by k-shell.
                <a href="http://apps.cytoscape.org/apps/wkshelldecomposition" target="_blank" class="pull-right btn btn-default btn-md"><i class="fa fa-angle-double-right fa-lg"></i></a>
              </p>
            </div>
          </div>
          <hr class="featurette-divider">
          <div class="row">
            <div class="col-md-offset-4 col-md-8">
              <h2 class="featurette-heading"><a href="https://github.com/finnor/big-spoon-alerts" target="_blank">Big Spoon Alerts</a></h2>
              <p class="lead text-muted">
                Do you like ice cream?
                Big Spoon Alerts scrapes the web page of a local ice cream shop for its menu, then compares the it to the previous iteration of the menu.
                Upon detecting changes, it generates an email notification to report the added and dropped flavors to the configured email address.
                <a href="https://github.com/finnor/big-spoon-alerts" target="_blank" class="pull-right btn btn-default btn-md"><i class="fa fa-angle-double-right fa-lg"></i></a>
              </p>
            </div>
          </div>
          <hr class="featurette-divider">
          <div class="row">
          <div class="col-md-offset-4 col-md-8">
            <h2 class="featurette-heading"><a href="https://github.com/finnor/reddit-submission-diff" target="_blank">Reddit Submission Diff</a></h2>
            <p class="lead text-muted">
              Are there any posts that receive regular updates on Reddit you follow, e.g. &quot;Best Of&quot; lists, FAQs, etc?
              Reddit Submission Diff uses the Reddit API to read the content of a designated post, then compares the post to the previous content of the post.
              It will then report a diff of the post's content to the configured email address.
              <a href="https://github.com/finnor/reddit-submission-diff" target="_blank" class="pull-right btn btn-default btn-md"><i class="fa fa-angle-double-right fa-lg"></i></a>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="card border border-brand-secondary mb-5">
      <h1 class="card-header text-center"><i class="fa fa-laptop"></i> Skills</h1>
      <div id="skills-chart" class="metric-charts"></div>
    </div>

    <div class="card border border-brand-secondary mb-5">
      <h1 class="card-header text-center"><i class="fa fa-building"></i> Employment</h1>
      <div class="card-body">
        <div class="row">
          <h4 class="col-md-12">Informatics Analyst II</h4>
          <div class="col-md-8">
            <ul>
              <li>
                Assist in the design, development and implementation of new computer programs including enterprise-level web applications and systems as a project section lead.
              </li>
              <li>
                Utilize modern HTML5+Javascript centered web computing, software development methodologies and object-oriented development methodologies to develop software applications and database systems (relational and NoSQL).
              </li>
              <li>
                Provide support using automated testing processes and version control systems.
              </li>
              <li>
                Provide support for the analysis, design, estimation, development, documentation, testing, and implementation of new applications.
              </li>
              <li>
                Provide maintenance and support for programs within existing systems.
              </li>
            </ul>
          </div>
          <div class="col-md-4">
            <p>November 2017 - Present</p>
            <p>University of Alabama at Birmingham</p>
            <p>Department of Pathology - Genomic Diagnostics &amp; Bioinformatics</p>
          </div>
        </div>
        <div class="row">
          <h4 class="col-md-12">Informatics Analyst I</h4>
          <div class="col-md-8">
            <ul>
              <li>
                Assist in the design, development and implementation of new computer programs including enterprise-level web applications and systems.
              </li>
              <li>
                Utilize modern HTML5+Javascript centered web computing, software development methodologies and object-oriented development methodologies to develop software applications and database systems (relational and NoSQL).
              </li>
              <li>
                Provide support using automated testing processes and version control systems.
              </li>
              <li>
                Provide support for the analysis, design, estimation, development, documentation, testing, and implementation of new applications.
              </li>
              <li>
                Provide maintenance and support for programs within existing systems.
              </li>
            </ul>
          </div>
          <div class="col-md-4">
            <p>November 2014 - October 2017</p>
            <p>University of Alabama at Birmingham</p>
            <p>Department of Pathology - Division of Informatics</p>
          </div>
        </div>
      </div>
    </div>

    <div class="card border border-brand-secondary mb-5">
      <h1 class="card-header text-center"><i class="fa fa-graduation-cap"></i> Education</h1>
      <div class="card-body">
        <div class="row">
          <h4 class="col-md-12">BS - Biology: Concentration in Molecular Biology</h4>
          <div class="col-md-8">
            <ul>
              <li>Systems Biology</li>
              <li>Molecular Genetics</li>
              <li>Genetics</li>
              <li>Epigenetics</li>
              <li>DNA Technology</li>
              <li>Cell Biology</li>
              <li>Microbiology</li>
              <li>Biochemistry</li>
            </ul>
          </div>
          <div class="col-md-4">
            <p>Spring 2016 - Summer 2019</p>
            <p>University of Alabama at Birmingham</p>
          </div>
        </div>
        <div class="row">
          <h4 class="col-md-12">MS - Software Engineering</h4>
          <div class="col-md-8">
            <ul>
              <li>Advanced Software Engineering Principles and Application</li>
              <li>Advanced Security</li>
              <li>Advanced Operating Systems</li>
              <li>Advanced Algorithm Analysis</li>
              <li>Software Testing</li>
              <li>Statistics</li>
              <li>Image Analysis/Processing</li>
              <li>Modeling and Simulation</li>
              <li>Client/Server Architectures</li>
            </ul>
          </div>
          <div class="col-md-4">
            <p>Fall 2011 - Spring 2013</p>
            <p>University of Alabama at Huntsville</p>
          </div>
        </div>
        <div class="row">
          <h4 class="col-md-12">BS - Computer and Information Science</h4>
          <div class="col-md-8">
            <ul>
              <li>Bioinformatics</li>
              <li>Security</li>
              <li>Networking</li>
              <li>Language/Automata Theory</li>
              <li>Operating Systems</li>
              <li>Algorithm Analysis</li>
            </ul>
          </div>
          <div class="col-md-4">
            <p>Fall 2005 - Spring 2011</p>
            <p>University of Alabama at Birmingham</p>
          </div>
        </div>
      </div>
    </div>

    <div class="card border border-brand-secondary mb-5">
      <h1 class="card-header text-center"><i class="fa fa-mobile"></i> Contact</h1>
      <div class="card-body">
        <p>Email: aflannery@uabmc.edu</p>
      </div>
    </div>
  </div>
</template>

<script>
import DonutChart from "@/components/DonutChart.vue";

export default {
  name: 'Home',
  components: { DonutChart }
}
  
</script>
