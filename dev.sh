#!/bin/bash

# GitSocial Development Script
# This script contains all commands needed to develop and run the app

set -e  # Exit on any error

echo "🚀 GitSocial Development Script"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_header() {
    echo -e "\n${PURPLE}🔧 $1${NC}"
    echo "----------------------------------------"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node --version)
    print_info "Node.js version: $NODE_VERSION"
}

# Install dependencies
install_deps() {
    print_header "Installing Dependencies"
    
    if [ ! -d "node_modules" ]; then
        print_info "Installing npm dependencies..."
        npm install
        print_status "Dependencies installed successfully"
    else
        print_info "Dependencies already installed. Run 'npm install' to update if needed."
    fi
}

# Development server
dev_server() {
    print_header "Starting Development Server"
    print_info "Starting Next.js development server on http://localhost:3000"
    print_warning "Press Ctrl+C to stop the server"
    npm run dev
}

# Build for production
build_app() {
    print_header "Building for Production"
    print_info "Creating optimized production build..."
    npm run build
    print_status "Production build created in ./out directory"
}

# Serve production build locally
serve_build() {
    print_header "Serving Production Build"
    
    if [ ! -d "out" ]; then
        print_warning "No production build found. Building first..."
        build_app
    fi
    
    print_info "Serving production build on http://localhost:3001"
    print_warning "Press Ctrl+C to stop the server"
    
    # Check if serve is installed globally, if not use npx
    if command -v serve &> /dev/null; then
        serve out -p 3001
    else
        npx serve out -p 3001
    fi
}

# Lint the code
lint_code() {
    print_header "Linting Code"
    npm run lint
    print_status "Code linting completed"
}

# Clean build artifacts
clean_build() {
    print_header "Cleaning Build Artifacts"
    
    if [ -d ".next" ]; then
        rm -rf .next
        print_status "Removed .next directory"
    fi
    
    if [ -d "out" ]; then
        rm -rf out
        print_status "Removed out directory"
    fi
    
    print_status "Build artifacts cleaned"
}

# Show git status
git_status() {
    print_header "Git Repository Status"
    
    if [ -d ".git" ]; then
        git status --short
        echo ""
        echo -e "${CYAN}Repository Status:${NC}"
        git status | grep "On branch" || echo "• Not on any branch"
        echo "• Tracked files: $(git ls-files 2>/dev/null | wc -l | xargs echo)"
        echo "• Ready to add: $(git status --porcelain 2>/dev/null | grep "^??" | wc -l | xargs echo)"
        echo "• Modified files: $(git status --porcelain 2>/dev/null | grep "^.M" | wc -l | xargs echo)"
    else
        print_info "Git repository not initialized. Run 'git init' to start version control."
    fi
}

# Show project info
show_info() {
    print_header "Project Information"
    echo -e "${CYAN}Project:${NC} GitSocial - Distributed Social Media"
    echo -e "${CYAN}Description:${NC} A social media platform where users own their data via GitHub repositories"
    echo -e "${CYAN}Tech Stack:${NC} Next.js 14, React 18, TypeScript, Tailwind CSS"
    echo -e "${CYAN}Architecture:${NC} Static export optimized for GitHub Pages"
    echo ""
    echo -e "${CYAN}Available URLs:${NC}"
    echo "• Development: http://localhost:3000"
    echo "• Production: http://localhost:3001"
    echo ""
    echo -e "${CYAN}Key Features:${NC}"
    echo "• Instagram-like UI with distributed data ownership"
    echo "• GitHub OAuth integration framework"
    echo "• Real-time social interactions"
    echo "• Mobile-responsive design"
    echo "• Static export for easy deployment"
}

# Show available commands
show_help() {
    echo ""
    echo -e "${CYAN}GitSocial Development Commands:${NC}"
    echo ""
    echo -e "${YELLOW}Setup & Installation:${NC}"
    echo "  ./dev.sh install     - Install npm dependencies"
    echo "  ./dev.sh check       - Check system requirements"
    echo ""
    echo -e "${YELLOW}Development:${NC}"
    echo "  ./dev.sh dev         - Start development server (http://localhost:3000)"
    echo "  ./dev.sh lint        - Run ESLint code linting"
    echo ""
    echo -e "${YELLOW}Production:${NC}"
    echo "  ./dev.sh build       - Build for production"
    echo "  ./dev.sh serve       - Serve production build (http://localhost:3001)"
    echo ""
    echo -e "${YELLOW}Utilities:${NC}"
    echo "  ./dev.sh clean       - Clean build artifacts"
    echo "  ./dev.sh info        - Show project information"
    echo "  ./dev.sh status      - Show git repository status"
    echo "  ./dev.sh help        - Show this help message"
    echo ""
    echo -e "${YELLOW}Quick Start:${NC}"
    echo "  ./dev.sh install && ./dev.sh dev"
    echo ""
}

# Main script logic
case "$1" in
    "install")
        check_node
        install_deps
        ;;
    "dev")
        check_node
        install_deps
        dev_server
        ;;
    "build")
        check_node
        install_deps
        build_app
        ;;
    "serve")
        check_node
        serve_build
        ;;
    "lint")
        check_node
        lint_code
        ;;
    "clean")
        clean_build
        ;;
    "check")
        check_node
        print_status "System requirements check passed"
        ;;
    "info")
        show_info
        ;;
    "status")
        git_status
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    "")
        print_info "GitSocial is ready to run! 🚀"
        show_info
        echo ""
        print_warning "Run './dev.sh help' to see all available commands"
        print_info "Quick start: './dev.sh dev' to start development server"
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
