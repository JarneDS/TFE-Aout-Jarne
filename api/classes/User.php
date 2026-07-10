<?php

class User {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    public function register(string $username, string $email, string $password): bool {
        // Vérifie si email existe
        $stmt = $this->db->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);

        if ($stmt->fetch()) {
            return false;
        }

        // Hash sécurisé
        $hash = password_hash($password, PASSWORD_DEFAULT);

        // Insert
        $stmt = $this->db->prepare(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)"
        );

        return $stmt->execute([$username, $email, $hash]);
    }

    public function login(string $email, string $password): bool {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) return false;

        if (!password_verify($password, $user['password'])) {
            return false;
        }

        // Démarre la session
        $_SESSION['user'] = [
            'id' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email']
        ];

        return true;
    }

    public function logout(): void {
        session_destroy();
    }

    public function isLogged(): bool {
        return isset($_SESSION['user']);
    }
}

?>
