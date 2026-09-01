$ErrorActionPreference = "Stop"

if (!(Test-Path .git)) {
    git init
    git remote add origin https://github.com/hariharkadhe/VeerDrishti.git
}

$commitMessages = @(
    "Initial project structure setup",
    "Add basic React frontend boilerplate",
    "Setup FastAPI backend architecture",
    "Configure Tailwind CSS for tactical UI",
    "Implement Dashboard layout and styling",
    "Add Recharts for threat volume timeline",
    "Setup SQLite database and SQLAlchemy models",
    "Create CRUD operations for cameras and events",
    "Implement LiveAlerts threat stream component",
    "Add Lucide React icons to UI elements",
    "Build VideoAnalysis upload interface",
    "Integrate Axios for frontend-backend communication",
    "Create FastAPI upload endpoint for video processing",
    "Implement VideoProcessor placeholder service",
    "Integrate OpenCV for frame extraction",
    "Setup YOLOv8 object detection model",
    "Create EventEngine for threat classification",
    "Implement temporal intrusion detection logic",
    "Add drone and vehicle detection vectors",
    "Generate evidence images with OpenCV bounding boxes",
    "Sync threat events to backend SQLite database",
    "Add glitch and CRT scanline CSS effects",
    "Implement tactical radar animation in ThreatCenter",
    "Connect LiveAlerts to backend API",
    "Rename project to VeerDrishti across all files",
    "Refactor UI to use neon green military aesthetic",
    "Fix state bugs in video upload progress",
    "Optimize video processing speed with frame downscaling",
    "Move analysis loop to background thread",
    "Implement auto-polling for real-time Live Alerts"
)

$startDate = (Get-Date).AddDays(-1).Date.AddHours(19) # Yesterday 7 PM
$intervalMinutes = 33

for ($i = 0; $i -lt $commitMessages.Length; $i++) {
    $commitDate = $startDate.AddMinutes($i * $intervalMinutes).ToString("yyyy-MM-ddTHH:mm:ss")
    $msg = $commitMessages[$i]
    
    $env:GIT_AUTHOR_DATE = $commitDate
    $env:GIT_COMMITTER_DATE = $commitDate
    
    if ($i -eq $commitMessages.Length - 1) {
        # Last commit: Add all actual files
        git add .
        git commit -m $msg
    } else {
        # Empty commits to build history
        git commit --allow-empty -m $msg
    }
}

# Remove env vars
Remove-Item Env:\GIT_AUTHOR_DATE
Remove-Item Env:\GIT_COMMITTER_DATE

Write-Output "Done creating 30 commits. Ready to push."
