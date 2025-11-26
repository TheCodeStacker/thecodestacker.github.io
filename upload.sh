#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

print_info() { echo -e "${CYAN}ℹ${NC} $1"; }
print_success() { echo -e "${GREEN}✓${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠${NC} $1"; }

echo -e "${CYAN}╔════════════════════════════╗${NC}"
echo -e "${CYAN}║  Quick Upload to GitHub    ║${NC}"
echo -e "${CYAN}╚════════════════════════════╝${NC}\n"

# Check if we're in a git repository
if [ ! -d ".git" ]; then
	print_error "Not a git repository!"
	echo -e "${YELLOW}Current directory: $(pwd)${NC}"
	echo -e "${YELLOW}Make sure you're inside the cloned repository folder${NC}"
	echo -e "${CYAN}Example: cd your-repo-name${NC}"
	exit 1
fi

print_success "Git repository detected"

# Fix dubious ownership issue (common in Termux)
repo_path=$(pwd)
print_info "Adding safe directory..."
git config --global --add safe.directory "$repo_path" 2>/dev/null

# Check git configuration
git_user=$(git config user.name)
git_email=$(git config user.email)

if [ -z "$git_user" ] || [ -z "$git_email" ]; then
	print_error "Git not configured!"
	echo -e "${YELLOW}Run these commands:${NC}"
	echo -e "${CYAN}git config --global user.name 'Your Name'${NC}"
	echo -e "${CYAN}git config --global user.email 'your@email.com'${NC}"
	exit 1
fi

print_info "Git user: $git_user"

# Get current status
print_info "Checking for changes..."
status_output=$(git status --porcelain 2>&1)

if [ $? -ne 0 ]; then
	print_error "Git status failed"
	echo -e "${YELLOW}Error details:${NC}"
	echo "$status_output"
	exit 1
fi

# Count changes
if [ -z "$status_output" ]; then
	print_warning "No changes to commit"
	echo -e "${CYAN}Working tree is clean${NC}"
	exit 0
fi

changes=$(echo "$status_output" | wc -l)
print_success "Found $changes file(s) with changes"

echo -e "\n${CYAN}Changed files:${NC}"
git status --short

echo -e "\n${YELLOW}Commit message (press Enter for auto message):${NC}"
read -p "$(echo -e "${CYAN}Message:${NC} ")" commit_msg

if [ -z "$commit_msg" ]; then
	commit_msg="Update: $(date '+%Y-%m-%d %H:%M:%S')"
	print_info "Using default message: $commit_msg"
fi

print_info "Adding all changes..."
if ! git add .; then
	print_error "Failed to add files"
	exit 1
fi

print_info "Committing changes..."
if ! git commit -m "$commit_msg"; then
	print_error "Commit failed"
	exit 1
fi
print_success "Changes committed"

print_info "Pushing to GitHub..."
push_output=$(git push 2>&1)
push_status=$?

if [ $push_status -eq 0 ]; then
	print_success "Successfully uploaded to GitHub!"
else
	print_error "Failed to push changes"
	echo -e "\n${YELLOW}Error details:${NC}"
	echo "$push_output"
	echo -e "\n${YELLOW}Common solutions:${NC}"
	echo -e "${CYAN}1. Pull first: git pull${NC}"
	echo -e "${CYAN}2. Check credentials: git config credential.helper${NC}"
	echo -e "${CYAN}3. Force push: git push -f${NC} ${RED}(careful!)${NC}"
	exit 1
fi

echo -e "\n${GREEN}✓ All done!${NC}"
