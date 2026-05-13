Add-Type -AssemblyName System.Windows.Forms

$balloon = New-Object System.Windows.Forms.NotifyIcon
$balloon.Icon = [System.Drawing.SystemIcons]::Information
$balloon.BalloonTipIcon = [System.Windows.Forms.ToolTipIcon]::Info
$balloon.BalloonTipTitle = "Claude Code — FollowYourBaby"
$balloon.BalloonTipText = "Task hoàn thành!"
$balloon.Visible = $true
$balloon.ShowBalloonTip(5000)

Start-Sleep -Seconds 5
$balloon.Dispose()
