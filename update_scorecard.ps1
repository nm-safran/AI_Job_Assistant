$filePath = "c:\Users\Safran\Desktop\ai-job-assistant\frontend\src\components\AIScoreCard.js"
$content = Get-Content $filePath -Raw

# Update score breakdown cards
$content = $content -replace 'border border-gray-200 rounded-lg p-4\s*>(\s*<div class="flex items-center justify-between mb-3">)', 'glass-card-hover p-4">$1'
$content = $content -replace 'text-sm font-medium text-gray-600', 'text-sm font-semibold text-charcoal-300'
$content = $content -replace 'bg-gray-200 rounded-full', 'bg-charcoal-700 rounded-full'
$content = $content -replace 'text-xs text-gray-500', 'text-xs text-charcoal-400'

# Update progress bar colors
$content = $content -replace "bg-green-500'", "bg-emerald-500'"
$content = $content -replace "bg-blue-500'", "bg-amber-500'"
$content = $content -replace "bg-yellow-500'", "bg-orange-500'"

# Update strengths section
$content = $content -replace '<div className="mb-8">(\s*<h4 className="text-lg font-semibold text-green-800)', '<div className="glass-card p-6 mb-6">$1'
$content = $content -replace 'text-lg font-semibold text-green-800 mb-4 flex items-center', 'text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2'
$content = $content -replace 'grid grid-cols-1 md:grid-cols-2 gap-4">(\s*\{scoreData\.strengths\.map)', 'grid grid-cols-1 md:grid-cols-2 gap-3">$1'
$content = $content -replace 'bg-green-50 border border-green-200', 'bg-emerald-500/10 border border-emerald-500/20'
$content = $content -replace 'text-green-800 text-sm', 'text-emerald-300 text-sm'

# Update weaknesses section
$content = $content -replace 'text-lg font-semibold text-red-800 mb-4 flex items-center', 'text-lg font-bold text-orange-400 mb-4 flex items-center gap-2'
$content = $content -replace 'bg-red-50 border border-red-200', 'bg-orange-500/10 border border-orange-500/20'
$content = $content -replace 'text-red-800 text-sm', 'text-orange-300 text-sm'

# Update critical issues
$content = $content -replace 'text-lg font-semibold text-red-900', 'text-lg font-bold text-red-400'
$content = $content -replace 'space-y-3">(\s*\{scoreData\.critical_issues)', 'space-y-2">$1'
$content = $content -replace 'bg-red-100 border-2 border-red-300', 'bg-red-500/10 border border-red-500/20'
$content = $content -replace 'text-red-900 font-medium', 'text-red-300 font-medium'

# Update recommendations section
$content = $content -replace 'text-lg font-semibold text-blue-800 mb-4 flex items-center', 'text-lg font-bold text-amber-400 mb-4 flex items-center gap-2'
$content = $content -replace 'space-y-4">(\s*\{scoreData\.recommendations)', 'space-y-3">$1'
$content = $content -replace 'border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow', 'glass-card-hover p-4'
$content = $content -replace 'font-semibold text-gray-800', 'font-semibold text-cream-100'
$content = $content -replace 'text-gray-700 text-sm mb-2', 'text-charcoal-200 text-sm mb-2'
$content = $content -replace 'text-xs text-gray-500', 'text-xs text-charcoal-400'

# Update main container
$content = $content -replace '<div className="p-8">', '<div className="glass-card p-8">'
$content = $content -replace 'text-xl font-bold text-gray-800', 'text-xl font-bold text-cream-100'

$content | Set-Content $filePath -NoNewline
Write-Host "AIScoreCard.js updated successfully!"
