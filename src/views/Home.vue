<template>
  <landing :sticky="false">
    <div class="welcome">
      <div class="welcome-message">
        You found me! Welcome!  <i class="far fa-hand-spock"></i>
      </div>
    </div>

    <div class="container pt-5 mt-5">
      <div class="row mb-5">
        <div class="col-sm-6 d-flex align-content-stretch ">
          <div class="card w-100 border border-brand-secondary">
            <h1 class="card-header bg-white text-center"><i class="fa fa-user"></i> About Me</h1>
            <div class="card-body">
              <p>
                My name is Adrian Flannery. I am software developer based out of Birmingham, Alabama.
                This is a space where I hope to showcase some of my talents.
              </p>
            </div>
          </div>
        </div>
        <div class="d-block d-sm-none mt-4">.</div>
        <div class="col-sm-6 d-flex align-content-stretch ">
          <div class="card w-100 border border-brand-secondary">
            <h1 class="card-header bg-white text-center"><i class="fa fa-mobile-alt"></i> Contact</h1>
            <div class="card-body">
              <dl class="row">
                <dt class="col-3 font-weight-bold text-right">Git:</dt>
                <dd class="col-9"><a href="https://github.com/finnor" target="_blank" rel="noopener">https://github.com/finnor</a></dd>
                <dt class="col-3 font-weight-bold text-right">Email:</dt>
                <dd class="col-9">aflanry@gmail.com</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="card border border-brand-secondary mb-5">
        <h1 class="card-header bg-white text-center"><i class="fa fa-chart-pie"></i> Metrics</h1>
        <div class="card-body">
          <div class="row">
            <gauge-chart class="col-md-6"
              :params="{
                'chartLabel': 'Work Productivity',
              }"
            ></gauge-chart>
            <hr class="d-block d-md-none col-sm-12">
            <donut-chart class="col-md-6"
              :params="{
                'isPercent': true,
                'chartLabel': 'Outside Work',
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
                    'label':'Hiking',
                    'value': 20,
                  }
                ]
              }"
            ></donut-chart>
          </div>
        </div>
      </div>

      <div class="card border border-brand-secondary mb-5">
        <h1 class="card-header bg-white text-center"><i class="fa fa-folder-open"></i> Project Snapshots</h1>
        <div class="card-body">
          <div class="row">
            <div class="col-md-4">
              <router-link to="/MinesweeperJS"><img class="img-fluid d-block mx-auto" src="@/assets/images/MinesweeperJSPreview.jpeg" alt="MinesweeperJS"></router-link>
            </div>
            <div class="col-md-8">
              <h2><router-link to="/MinesweeperJS">MinesweeperJS</router-link></h2>
              <p class="lead text-muted">
                A Javascript implementation of the classic minesweeper game with a helper to guide a player on how the game is played and show the patterns that can be used to solve the game.
              </p>
              <p class="text-lg">
                &bull; <a href="https://github.com/finnor/MinesweeperJS" target="_blank" rel="noopener">git</a>
                &bull; <a href="https://www.npmjs.com/package/minesjs" target="_blank" rel="noopener">npm</a>
              </p>
              <router-link to="/MinesweeperJS" class="float-right btn btn-brand-secondary btn-sm"><i class="fa fa-angle-double-right fa-lg"></i></router-link>
            </div>
          </div>
          <hr>
          <div class="row">
            <div class="col-md-4">
              <router-link to="/SpectrumToRGB"><img class="img-fluid d-block mx-auto" src="@/assets/images/SpectrumToRGB_sample.jpeg" alt="SpectrumToRGB"></router-link>
            </div>
            <div class="col-md-8">
              <h2><router-link to="/SpectrumToRGB">SpectrumToRGB</router-link></h2>
              <p class="lead text-muted">
                Have you ever wondered what a pigment looks like if you purified a macroscopic amount?
                SpectrumToRGB takes an input absorbance or reflectance spectrum and approximates the color in RGB space.
              </p>
              <p class="text-lg">
                &bull; <a href="https://github.com/finnor/SpectrumToRGB/" target="_blank" rel="noopener">git</a>
                &bull; <a href="https://www.npmjs.com/package/spectrum-to-rgb" target="_blank" rel="noopener">npm</a>
              </p>
              <router-link to="/SpectrumToRGB" class="float-right btn btn-brand-secondary btn-sm"><i class="fa fa-angle-double-right fa-lg"></i></router-link>
            </div>
          </div>
          <hr>
          <div class="row">
            <div class="col-md-4">
              <router-link to="/DNAAlignmentXY"><img class="img-fluid d-block mx-auto" src="@/assets/images/DNAAlignmentXY_sample.jpeg" alt="DNAAlignmentXY"></router-link>
            </div>
            <div class="col-md-8">
              <h2><router-link to="/DNAAlignmentXY">DNA Alignment XY</router-link></h2>
                <p class="lead text-muted">
                  In 2014, researchers combined two artificial codons into the genetic code of a viable, self-replicating organism. This project takes the local
                  and global sequence alignment algorithms and adapts them to use separate scoring strategies for natural and artificial codons. Requires Silverlight.
                </p>
                <p class="text-lg">
                  &bull; <a href="https://github.com/finnor-archive/base/tree/master/C%23/DNAAlignmentXYWeb" target="_blank" rel="noopener">git</a> 
                </p>
                <router-link to="/DNAAlignmentXY" class="float-right btn btn-brand-secondary btn-sm"><i class="fa fa-angle-double-right fa-lg"></i></router-link>
            </div>
          </div>
          <hr>
          <div class="row">
            <div class="col-md-4">
              <a href="http://apps.cytoscape.org/apps/wkshelldecomposition" target="_blank" rel=”noopener”><img class="img-fluid d-block mx-auto" src="http://apps.cytoscape.org/media/wkshelldecomposition/screenshots/Example%20Network%20Layout.png" alt="wk Shell Decomposition"></a>
            </div>
            <div class="col-md-8">
              <h2><a href="http://apps.cytoscape.org/apps/wkshelldecomposition" target="_blank" rel=”noopener”>wk Shell Decomposition</a></h2>
              <p class="lead text-muted">
                wk-shell-decomposition is a Cytoscape 3 app that performs a k-shell decomposition on a network using a weighted algorithm.
                k-shell decomposition is a method that ranks the most important nodes in a network and partitions them into shells based on that rank.
                The app also adjusts the layout of the network to packed concentric rings sorted by k-shell and applies a gradient to the color of the nodes by k-shell.
              </p>
              <p class="text-lg">
                &bull; <a href="https://github.com/finnor/wk-shell-decomposition" target="_blank" rel="noopener">git</a> 
              </p>
              <a href="http://apps.cytoscape.org/apps/wkshelldecomposition" target="_blank" rel=”noopener” class="float-right btn btn-brand-secondary btn-sm"><i class="fa fa-angle-double-right fa-lg"></i></a>
            </div>
          </div>
        </div>
      </div>

      <div class="card border border-brand-secondary mb-5">
        <h1 class="card-header bg-white text-center"><i class="fa fa-laptop"></i> Skills</h1>
        <div class="card-body">
          <bar-chart-collection
            :params="{
              charts: jobSkills
            }"
          ></bar-chart-collection>
        </div>
      </div>

      <div class="card border border-brand-secondary mb-5">
        <h1 class="card-header bg-white text-center"><i class="fa fa-building"></i> Employment</h1>
        <div class="card-body">
          <div class="row border p-3 m-1">
            <h4 class="col-md-12">Informatics Analyst II</h4>
            <div class="col-md-8">
              <ul>
                <li>
                  Designed, implemented, and maintained a data pipeline development framework devised to promote rapid development of ETL pipelines when extracting from the same source and/or loading to the same target.
                </li>
                <li>
                  Developed data pipelines to ingest and load multi-omic results from vendor and open source formats to multiple data analysis applications, empowering researchers with clean, accessible data.
                </li>
                <li>
                  Developed bioinformatics pipelines to analyze DNASeq data for small variant, CNV, and SV calling.
                </li>
                <li>
                  Developed a data pipeline and corresponding data analysis application to load millions of EMR records and subsequently derive insights on blood culture contamination and antimicrobial susceptibility patterns.
                </li>
                <li>
                  Designed, implemented, and maintained a web application to facilitate NGS analysis, interpretation, and reporting.
                </li>
                <li>
                  Defined test plans and implemented unit, integration, system and regression testing to verify and validate systems.
                </li>
                <li>
                  Regularly present status and findings to stakeholders.
                </li>
              </ul>
            </div>
            <div class="col-md-4">
              <div class="p-2 border-left border-wide">
                <p>November 2017 - Present</p>
                <p>University of Alabama at Birmingham</p>
                <p>Department of Pathology - Genomic Diagnostics &amp; Bioinformatics</p>
              </div>
            </div>
          </div>
          <div class="row border p-3 m-1">
            <h4 class="col-md-12">Informatics Analyst I</h4>
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
              <div class="p-2 border-left border-wide">
                <p>November 2014 - October 2017</p>
                <p>University of Alabama at Birmingham</p>
                <p>Department of Pathology - Division of Informatics</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card border border-brand-secondary mb-5">
        <h1 class="card-header bg-white text-center"><i class="fa fa-graduation-cap"></i> Education</h1>
        <div class="card-body">
          <div class="row border p-3 m-1">
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
              <div class="p-2 border-left border-wide">
                <p>Fall 2011 - Spring 2013</p>
                <p>University of Alabama at Huntsville</p>
              </div>
            </div>
          </div>
          <div class="row border p-3 m-1">
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
              <div class="p-2 border-left border-wide">
                <p>Fall 2005 - Spring 2011</p>
                <p>University of Alabama at Birmingham</p>
              </div>
            </div>
          </div>
          <div class="row border p-3 m-1">
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
              <div class="p-2 border-left border-wide">
                <p>Spring 2016 - Summer 2019</p>
                <p>University of Alabama at Birmingham</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </landing>
</template>

<style scoped>
.border-wide {
  border-width: 3px !important;
}
</style>

<script>
import Landing from '@/layouts/Landing.vue';
import BarChartCollection from '@/components/BarChartCollection.vue';
import DonutChart from "@/components/DonutChart.vue";
import GaugeChart from '@/components/GaugeChart.vue';
import jobSkills from "@/config/jobSkills.json";

export default {
  name: 'Home',
  components: { Landing, BarChartCollection, DonutChart, GaugeChart },
  data() {
    return {
      jobSkills: jobSkills
    }
  },
}
  
</script>