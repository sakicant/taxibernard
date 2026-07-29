<?php
require __DIR__ . '/auth.php';
tx_auto_complete_bookings();

$STATUSES = ['new', 'confirmed', 'completed', 'cancelled'];
// Owner-facing labels for the workflow states.
$STATUS_LABELS = [
    'new'       => 'Booking (unpaid)',
    'confirmed' => 'Upcoming (confirmed)',
    'completed' => 'Completed',
    'cancelled' => 'Cancelled',
];
$CHIP_LABELS = [
    'new' => 'Bookings', 'confirmed' => 'Upcoming', 'completed' => 'Completed', 'cancelled' => 'Cancelled',
];

$statusFilter = $_GET['status'] ?? '';
$q = trim($_GET['q'] ?? '');

// Sort modes offered in the UI. 'travel' is the default: upcoming rides first
// (soonest travel date on top), with completed/cancelled pushed to the bottom.
$SORTS = [
    'travel'  => 'Travel date',
    'booking' => 'Booking date',
    'name'    => 'Name (A-Z)',
];
$sort = $_GET['sort'] ?? 'travel';
if (!isset($SORTS[$sort])) $sort = 'travel';
switch ($sort) {
    case 'booking':
        // Newest booking first (when it was submitted).
        $orderBy = 'created_at DESC, id DESC';
        break;
    case 'name':
        // Alphabetical by customer, soonest travel date within the same name.
        $orderBy = 'customer_name ASC, pickup_date ASC, pickup_time ASC';
        break;
    case 'travel':
    default:
        // Active rides (new/confirmed) first by soonest date; done rides last.
        $orderBy = "(status IN ('completed','cancelled')) ASC, (pickup_date IS NULL) ASC, pickup_date ASC, pickup_time ASC";
        break;
}

$where = [];
$params = [];
if (in_array($statusFilter, $STATUSES, true)) {
    $where[] = 'status = ?';
    $params[] = $statusFilter;
}
if ($q !== '') {
    $where[] = '(customer_name LIKE ? OR customer_email LIKE ? OR pickup LIKE ? OR dropoff LIKE ?)';
    $like = '%' . $q . '%';
    array_push($params, $like, $like, $like, $like);
}
$sql = 'SELECT id, created_at, pickup, dropoff, pickup_date, pickup_time, customer_name, status, payment FROM bookings';
if ($where) $sql .= ' WHERE ' . implode(' AND ', $where);
$sql .= ' ORDER BY ' . $orderBy . ' LIMIT 500';
$stmt = tx_db()->prepare($sql);
$stmt->execute($params);
$bookings = $stmt->fetchAll();

$counts = ['all' => 0, 'new' => 0, 'confirmed' => 0, 'completed' => 0, 'cancelled' => 0];
foreach (tx_db()->query('SELECT status, COUNT(*) c FROM bookings GROUP BY status') as $r) {
    $counts[$r['status']] = (int) $r['c'];
    $counts['all'] += (int) $r['c'];
}

function chip_url($status)
{
    $params = $_GET;
    if ($status === '') unset($params['status']); else $params['status'] = $status;
    return 'index.php' . ($params ? '?' . http_build_query($params) : '');
}
function sort_url($sort)
{
    $params = $_GET;
    $params['sort'] = $sort;
    return 'index.php?' . http_build_query($params);
}
function fmt_date($date) { return $date ? date('j M Y', strtotime($date)) : '&mdash;'; }
function fmt_time($time) { return $time ? substr($time, 0, 5) : '&mdash;'; }
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>Bookings | TAXI Bernard Admin</title>
<link rel="stylesheet" href="admin.css">
</head>
<body class="admin-page">
  <header class="admin-header">
    <strong>TAXI Bernard &mdash; Bookings</strong>
    <nav class="admin-nav">
      <a href="index.php" class="active">Bookings</a>
      <a class="admin-logout" href="logout.php">Log out</a>
    </nav>
  </header>

  <div class="admin-wrap">
    <form class="admin-search" method="GET" action="index.php">
      <?php if ($statusFilter): ?><input type="hidden" name="status" value="<?= e($statusFilter) ?>"><?php endif; ?>
      <input type="hidden" name="sort" value="<?= e($sort) ?>">
      <input type="search" name="q" placeholder="Search name, email, route..." value="<?= e($q) ?>">
      <button type="submit" class="admin-btn">Search</button>
      <?php if ($q): ?><a class="admin-btn admin-btn-ghost" href="<?= e(chip_url($statusFilter)) ?>">Clear</a><?php endif; ?>
    </form>

    <nav class="admin-chips">
      <a class="admin-chip <?= $statusFilter === '' ? 'active' : '' ?>" href="<?= e(chip_url('')) ?>">All (<?= $counts['all'] ?>)</a>
      <?php foreach ($STATUSES as $s): ?>
        <a class="admin-chip status-<?= $s ?> <?= $statusFilter === $s ? 'active' : '' ?>" href="<?= e(chip_url($s)) ?>"><?= $CHIP_LABELS[$s] ?> (<?= $counts[$s] ?>)</a>
      <?php endforeach; ?>
    </nav>

    <div class="admin-sort">
      <span class="admin-sort-label">Sort by:</span>
      <?php foreach ($SORTS as $key => $label): ?>
        <a class="admin-sort-opt <?= $sort === $key ? 'active' : '' ?>" href="<?= e(sort_url($key)) ?>"><?= $label ?></a>
      <?php endforeach; ?>
    </div>

    <?php if (!$bookings): ?>
      <p class="admin-empty">No bookings found.</p>
    <?php else: ?>
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr><th>Ref</th><th>Client</th><th>Route</th><th>Date</th><th>Time</th><th>Status</th></tr>
        </thead>
        <tbody>
          <?php foreach ($bookings as $b): $url = 'booking.php?id=' . (int) $b['id']; ?>
          <tr class="row-link status-<?= e($b['status']) ?>" onclick="if(!window.getSelection().toString())location.href='<?= $url ?>'">
            <td class="col-ref"><a href="<?= $url ?>">#<?= (int) $b['id'] ?></a></td>
            <td><?= e($b['customer_name']) ?></td>
            <td class="col-route"><?= e($b['pickup']) ?> <span>&rarr;</span> <?= e($b['dropoff']) ?></td>
            <td><?= fmt_date($b['pickup_date']) ?></td>
            <td><?= fmt_time($b['pickup_time']) ?></td>
            <td><span class="status-badge status-<?= e($b['status']) ?>"><?= $CHIP_LABELS[$b['status']] ?? ucfirst($b['status']) ?></span></td>
          </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>
    <?php endif; ?>
  </div>
</body>
</html>
