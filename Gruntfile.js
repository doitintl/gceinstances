module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			task: {
				src: ['js/gceInstances.js'],
				dest: 'build/app.js'
			},
			options: {
				'mangle': {},
				'compress': true,
				'beautify': false,
				'expression': false,
				'report': 'min',
				'sourceMap': false,
				'sourceMapName': undefined,
				'sourceMapIn': undefined,
				'sourceMapIncludeSources': false,
				'enclose': undefined,
				'wrap': undefined,
				'exportAll': false,
				'preserveComments': undefined,
				'banner': '',
				'footer': ''
			}
		},
        copy: {
            html: {
                src: '*.html',
                dest: 'build/',
            },
            styles: {
                src: '*.css',
                dest: 'build/',
            },
            images: {
                src: '*.svg',
                dest: 'build/',
            },
            yaml: {
                src: '*.yaml',
                dest: 'build/',
            },
            favicon: {
                src: '*.ico',
                dest: 'build/',
            },
			data: {
				src: 'scraper/instances.json',
				dest: 'build/',
			},
            angular: {
                src: 'bower_components/angular/angular.min.js',
                dest: 'build/',
            },
            angular: {
                src: 'bower_components/angular-material/angular-material.css',
                dest: 'build/',
            },
            angular: {
                src: 'bower_components/angular/angular.min.js',
                dest: 'build/',
            },
            angular: {
                src: 'bower_components/angular/angular.min.js',
                dest: 'build/',
            },
            angular: {
                src: 'bower_components/angular/angular.min.js',
                dest: 'build/',
            },
            angular: {
                src: 'bower_components/angular/angular.min.js',
                dest: 'build/',
            },

        },
        clean: ["build/"]
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('default', ['clean','copy','uglify']);
};
