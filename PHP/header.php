<?php
if (!isset($header_theme_class)) {
    $header_theme_class = 'theme-default';
}

if ($is_logged_in) {
    ?>
    <header class="header <?php echo $header_theme_class; ?>"> 
        <div class="logo-container">
            <img src="<?php echo $path_prefix; ?>image/logo.png" alt="Logo" class="logo"> 
            <h1 class="title">Memory Game</h1>
        </div>
        <nav class="nav">
            <a href="<?php echo $path_prefix; ?>index.php" class="nav-link">Home</a>
            <a href="<?php echo $path_prefix; ?>Pages/perfil.php" class="nav-link">Perfil</a>
            <a href="<?php echo $path_prefix; ?>api/user_logout.php" class="nav-link">Logoff</a>
        </nav>
    </header>
    <?php
} else {
    ?>
    <header class="header <?php echo $header_theme_class; ?>">
        <div class="logo-container">
            <img src="<?php echo $path_prefix; ?>image/logo.png" alt="Logo" class="logo">
            <h1 class="title">Memory Game</h1>
        </div>
        <nav class="nav">
            <a href="<?php echo $path_prefix; ?>index.php" class="nav-link">Home</a>
            <a href="<?php echo $path_prefix; ?>Pages/login.php" class="nav-link">Login</a>
            <a href="<?php echo $path_prefix; ?>Pages/register.php" class="nav-link">Register</a>
        </nav>
    </header>
    <?php
}
?>