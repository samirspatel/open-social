'use client'

import { AlertCircle, Github, Globe, Users } from 'lucide-react'

export default function GitHubPagesInfo() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
      <div className="flex items-start space-x-3">
        <Github className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-blue-900 mb-2">
            You&apos;re viewing the GitSocial Demo on GitHub Pages
          </h3>
          
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-start space-x-2">
              <Globe className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Static Demo Mode</p>
                <p>This version shows the UI and features but uses mock data for demonstration.</p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Users className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Real GitSocial Network</p>
                <p>For the full experience with real GitHub integration, run GitSocial locally or deploy to a server with authentication support.</p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">User Registry</p>
                <p>Real users who sign up are registered in the <code className="bg-blue-100 px-1 rounded">user-data</code> branch as individual JSON files.</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-blue-200">
            <p className="text-xs text-blue-600">
              <a 
                href="https://github.com/samirpatel/open-social" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:underline font-medium"
              >
                View source code →
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
