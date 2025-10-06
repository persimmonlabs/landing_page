# Rose-Hulman Tennis AI Social Media System - Complete Setup Guide

## 🎯 System Overview

This comprehensive system handles ALL Rose-Hulman Tennis social media needs through a single Telegram bot with multiple AI-powered workflows:

### Core Components:
1. **telegram-router.json** - Master AI agent that routes all Telegram messages
2. **enhanced-action-shot-workflow.json** - Pre/match-day/score/highlight posts
3. **custom-post-workflow.json** - Custom posts with photos from Telegram
4. **daily-filler-workflow.json** - Ensures at least one post per day
5. **player-submission-workflow.json** - Handles player suggestions
6. **approval-handler.json** - Unified approval system with edit capability

## 📱 How It Works

### Telegram Group Chat Features:
- **Single Bot**: One Telegram bot handles everything
- **Group Chat**: Coach and manager in one chat for all approvals
- **AI Router**: Analyzes every message and routes appropriately
- **Auto-Processing**: Match results, custom posts, player suggestions all handled automatically

### Post Types Managed:
1. **Pre-Match** (day before) - Builds excitement
2. **Match-Day** (2-3 hours before) - Creates urgency  
3. **Score Posts** (after match) - Share results
4. **Highlight Posts** - Player spotlights
5. **Custom Posts** - Photo + caption from Telegram
6. **Daily Filler** - Ensures daily content from "bank" folder
7. **Player Submissions** - Filtered suggestions from team

## 🛠️ Setup Instructions

### 1. Create Telegram Bot
```bash
# Message @BotFather on Telegram
/newbot
# Follow prompts to create bot
# Save bot token as TELEGRAM_BOT_TOKEN
# Add bot to group chat with coach/manager
# Set bot as admin in group
```

### 2. Set Up Google Services

#### Google Drive Folders (Create these folders):
```
ACTION_SHOTS_FOLDER_ID - Player action photos (named as PlayerName.jpg)
BANK_FOLDER_ID - Daily filler content library
PREMATCH_TEMPLATES_ID - Pre-match slide templates
MATCHDAY_TEMPLATES_ID - Match-day slide templates  
SCORE_TEMPLATES_ID - Score announcement templates
HIGHLIGHT_TEMPLATES_ID - Player highlight templates
CUSTOM_POSTS_TEMPLATES_ID - Custom post templates
CUSTOM_POSTS_FOLDER_ID - Uploaded custom content
PLAYER_SUBMISSIONS_FOLDER_ID - Player submission content
PENDING_APPROVAL_FOLDER_ID - Posts awaiting approval
APPROVED_POSTS_FOLDER_ID - Final approved content
OUTPUT_FOLDER_ID - Final deliverables
```

#### Google Sheets (Create these sheets):
```
MATCH_SCHEDULE_SHEET_ID - Match schedule with columns:
  - date, time, team, opponent, venue, match_id

POSTS_LOG_SHEET_ID - All posted content with columns:
  - post_id, timestamp, post_type, match_id, photo_id, 
    photo_name, caption, status, approved_at

PENDING_POSTS_SHEET_ID - Posts awaiting approval:
  - post_id, timestamp, post_type, sender, caption, 
    photo_url, photo_id, status, chat_id

TELEGRAM_LOG_SHEET_ID - Message tracking:
  - timestamp, sender, message_text, message_type, 
    workflow_triggered, ai_notes

TELEGRAM_INPUTS_SHEET_ID - Processed Telegram data:
  - timestamp, from_user, raw_message, parsed_score,
    parsed_opponent, parsed_player, summary

PLAYER_SUBMISSIONS_SHEET_ID - Player content tracking:
  - post_id, timestamp, submitted_by, original_message,
    content_type, relevance_score, media_url, status
```

### 3. Configure Credentials in n8n

#### Required Credentials:
```
TELEGRAM_BOT_CRED_ID - Telegram Bot API token
OPENAI_API_KEY - OpenAI API key (GPT-4 recommended)
GOOGLE_SHEETS_CRED - Google Sheets OAuth2
GOOGLE_DRIVE_CRED - Google Drive OAuth2  
GOOGLE_OAUTH_CRED - Google OAuth2 for Slides API
```

#### Environment Variables:
```
TELEGRAM_BOT_TOKEN - Your bot token from BotFather
TELEGRAM_GROUP_CHAT_ID - Your group chat ID
OPENAI_API_KEY - Your OpenAI API key
```

### 4. Import Workflows into n8n
1. Import each JSON file as a separate workflow
2. Replace all placeholder IDs with your actual IDs
3. Test each workflow individually
4. Enable all workflows

### 5. Configure Action Shot Naming
Name action shot files as: `PlayerFirstName_PlayerLastName.jpg`
Examples: `John_Smith.jpg`, `Sarah_Johnson.jpg`

### 6. Create Slide Templates
Create Google Slides templates with these placeholder tokens:
- `{{DATE}}` - Match date
- `{{TIME}}` - Match time  
- `{{TEAM}}` - Team name
- `{{OPPONENT}}` - Opponent name
- `{{VENUE}}` - Match venue
- `{{PLAYER}}` - Player name
- `{{PHOTO}}` - Photo placeholder (replace with action shot)
- `{{SCORE}}` - Final score
- `{{ACHIEVEMENT}}` - Player achievements
- `{{HEADLINE}}` - Post headline

## 🚀 Usage Guide

### For Coaches/Managers:

#### Match Results:
Send natural language messages:
```
"We won 7-2 against Wabash! John Smith was incredible in singles."
"Lost 5-4 to DePauw but Sarah played amazingly in doubles."
```

#### Custom Posts:
Send photo with caption:
```
Photo + "Great practice session today! Team looking strong."
Photo + "New equipment arrived - ready for conference play!"
```

#### Approvals:
Respond to approval requests:
- ✅ or "approve" - Approve post
- ❌ or "reject" - Reject post
- ✏️ Edit: [new caption] - Edit and approve

#### Status Commands:
```
/status - View posting schedule and stats
/help - Show available commands
```

### For Players:
Send photos with captions for suggestions:
```
Photo + "Check out this amazing shot from practice!"
Photo + "Team bonding at dinner last night 🎾"
```

## 🤖 AI Features

### Intelligent Message Routing:
- Analyzes sender role (coach/manager/player)
- Determines message intent and urgency
- Routes to appropriate workflow
- Provides acknowledgments

### Smart Photo Selection:
- Tracks usage history to avoid repetition
- Matches players for highlight posts
- Analyzes photo quality with AI
- Selects best content for daily posts

### Dynamic Caption Generation:
- Context-aware captions for each post type
- Varies tone and style automatically
- Includes relevant hashtags and emojis
- Matches team voice and branding

### Content Quality Control:
- Filters inappropriate player submissions
- Validates match data accuracy
- Ensures consistent posting quality
- Maintains brand standards

## 📅 Automated Posting Schedule

### Daily Checks:
- **2:00 PM** - Daily filler post (if no posts today)
- **Every 2 hours** - Check for needed match posts

### Match Day Timeline:
- **Day before** - Pre-match hype post
- **2-3 hours before** - Match-day excitement post
- **After match** - Score and highlight posts (from Telegram input)

### Content Priority:
1. Match-related posts (highest priority)
2. Custom posts from coach/manager
3. Player submissions (filtered)
4. Daily filler content (as needed)

## 🔧 Maintenance & Monitoring

### System Health Checks:
- Monitor Telegram message logs
- Check workflow execution status
- Verify credential connections
- Review posting analytics

### Content Management:
- Add new action shots regularly
- Update slide templates seasonally
- Refresh bank content monthly
- Archive old posts quarterly

### Performance Optimization:
- Track posting engagement
- Analyze AI caption performance
- Monitor approval response times
- Adjust posting schedules based on data

## 🆘 Troubleshooting

### Common Issues:

#### Bot Not Responding:
1. Check bot token in credentials
2. Verify bot is admin in group chat
3. Test webhook connectivity
4. Check n8n workflow status

#### Photos Not Selected:
1. Verify folder permissions
2. Check file naming convention
3. Confirm Drive API access
4. Test photo analysis workflow

#### Templates Not Updating:
1. Check Slides API credentials
2. Verify template placeholders
3. Test OAuth2 connection
4. Review template folder structure

#### Approval System Issues:
1. Check Telegram group permissions
2. Verify message routing
3. Test approval handler workflow
4. Review pending posts sheet

### Error Recovery:
- All workflows include error handling
- Failed posts log to error sheet
- Manual retry options available
- Fallback content systems

## 📈 Success Metrics

Track these KPIs:
- **Posting Consistency**: 7+ posts per week
- **Response Time**: <2 hours for match results
- **Approval Rate**: >90% for auto-generated content
- **Engagement**: Monitor Instagram metrics
- **Team Satisfaction**: Regular feedback collection

## 🔮 Future Enhancements

Planned features:
- Instagram direct posting integration
- Automated story creation
- Video content processing
- Advanced analytics dashboard
- Multi-sport expansion
- Fan engagement features

---

## Quick Start Checklist

- [ ] Create Telegram bot and add to group
- [ ] Set up all Google Drive folders
- [ ] Create all Google Sheets
- [ ] Configure n8n credentials  
- [ ] Import all 6 workflows
- [ ] Replace all placeholder IDs
- [ ] Upload action shot photos
- [ ] Create slide templates
- [ ] Test each workflow
- [ ] Enable all workflows
- [ ] Send test messages
- [ ] Verify approvals work
- [ ] Go live! 🚀

**System Ready**: When all checkboxes are complete, the system will automatically manage all Rose-Hulman Tennis social media needs with minimal manual intervention!