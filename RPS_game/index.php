<?php
ini_set('log_errors', 'on');  //ログを取るか
ini_set('error_log', 'php.log');  //ログの出力ファイルを指定
session_start(); //セッション使う

$hands = array('グー', 'チョキ', 'パー');
$opponents = array();
$playerHandImg = '';
$opponentHandImg = '';

// クラス設計
//================================
abstract class User
{
  protected $name;
  protected $hp;
  protected $attackMin;
  protected $attackMax;
  public function setName($str)
  {
    $this->name = $str;
  }
  public function getName()
  {
    return $this->name;
  }
  public function setHp($num)
  {
    $this->hp = $num;
  }
  public function getHp()
  {
    return $this->hp;
  }
  public function attack($targetObj)
  {
    $attackPoint = mt_rand($this->attackMin, $this->attackMax);
    $targetObj->setHp($targetObj->getHp() - $attackPoint);
    History::set($attackPoint . 'ポイントのダメージ！');
  }
}

class Player extends User
{
  public function __construct($name, $hp, $attackMin, $attackMax)
  {
    $this->name = $name;
    $this->hp = $hp;
    $this->attackMin = $attackMin;
    $this->attackMax = $attackMax;
  }
}

class Computer extends User
{
  public function __construct($name, $hp, $attackMin, $attackMax)
  {
    $this->name = $name;
    $this->hp = $hp;
    $this->attackMin = $attackMin;
    $this->attackMax = $attackMax;
  }
}

class History
{
  public static function set($str)
  {
    if (empty($_SESSION['history'])) $_SESSION['history'] = '';
    $_SESSION['history'] .= $str . '<br>';
  }
  public static function clear()
  {
    unset($_SESSION['history']);
  }
}

// インスタンス生成
$player = new Player('プレイヤー', 500, 100, 200);
$opponents[] = new Computer('コンピューター1', 100, 50, 100);
$opponents[] = new Computer('コンピューター2', 200, 100, 200);
$opponents[] = new Computer('コンピューター3', 300, 150, 250);
$opponents[] = new Computer('コンピューター4', 400, 200, 300);
$opponents[] = new Computer('コンピューター5', 500, 250, 350);

// メソッド
function createPlayer()
{
  global $player;
  $_SESSION['player'] = $player;
}

function createOpponent()
{
  global $opponents;
  $opponent = $opponents[mt_rand(0, 4)];
  $_SESSION['opponent'] = $opponent;
}

function init()
{
  History::clear();
  History::set('初期化します');
  $_SESSION['knockDownCount'] = 0;
  createPlayer();
  createOpponent();
}

function gameOver()
{
  $_SESSION = array();
}

// じゃんけん判定処理
function judgement($myHand, $opponentHand)
{
  global $player;
  global $opponent;
  if ($myHand === 'グー') {
    switch ($opponentHand) {
      case 'グー':
        History::set('あいこ！');
        break;
      case 'チョキ':
        History::set('勝ち！');
        $player->attack($opponent);
        break;
      case 'パー':
        History::set('負け！');
        $opponent->attack($player);
        break;
    }
  }
  if ($myHand === 'チョキ') {
    switch ($opponentHand) {
      case 'グー':
        History::set('負け！');
        $opponent->attack($player);
        break;
      case 'チョキ':
        History::set('あいこ！');
        break;
      case 'パー':
        History::set('勝ち！');
        $player->attack($opponent);
        break;
    }
  }
  if ($myHand === 'パー') {
    switch ($opponentHand) {
      case 'グー':
        History::set('勝ち！');
        $player->attack($opponent);
        break;
      case 'チョキ':
        History::set('負け！');
        $opponent->attack($player);
        break;
      case 'パー':
        History::set('あいこ！');
        break;
    }
  }
}

// POST送信時処理
//================================
if (!empty($_POST)) {
  $startFlg = (!empty($_POST['start'])) ? true : false;
  $choiceFlg = (!empty($_POST['choice'])) ? true : false;
  error_log('POSTされた！');

  if ($startFlg) {
    History::set('ゲームスタート！');
    init();
  } else {
    if ($choiceFlg) {
      History::set('じゃんけんぽん！');

      // 手をセット
      $playerHand = $_POST['choice'];
      $opponentHand = $hands[mt_rand(0, 2)];
      error_log('自分の手は' . $playerHand);
      error_log('相手の手は' . $opponentHand);

      // 手のイメージをセット
      switch ($playerHand) {
        case 'グー':
          $playerHandImg = './img/rock.jpg';
          break;
        case 'チョキ':
          $playerHandImg = './img/scissors.jpg';
          break;
        case 'パー':
          $playerHandImg = './img/paper.jpg';
          break;
      }
      switch ($opponentHand) {
        case 'グー':
          $opponentHandImg = './img/rock.jpg';
          break;
        case 'チョキ':
          $opponentHandImg = './img/scissors.jpg';
          break;
        case 'パー':
          $opponentHandImg = './img/paper.jpg';
          break;
      }

      if ($playerHand === 'グー') {
        switch ($opponentHand) {
          case 'グー':
            History::set('あいこ！');
            break;
          case 'チョキ':
            History::set('勝ち！');
            $_SESSION['player']->attack($_SESSION['opponent']);
            break;
          case 'パー':
            History::set('負け！');
            $_SESSION['opponent']->attack($_SESSION['player']);
            break;
        }
      }
      if ($playerHand === 'チョキ') {
        switch ($opponentHand) {
          case 'グー':
            History::set('負け！');
            $_SESSION['opponent']->attack($_SESSION['player']);
            break;
          case 'チョキ':
            History::set('あいこ！');
            break;
          case 'パー':
            History::set('勝ち！');
            $_SESSION['player']->attack($_SESSION['opponent']);
            break;
        }
      }
      if ($playerHand === 'パー') {
        switch ($opponentHand) {
          case 'グー':
            History::set('勝ち！');
            $_SESSION['player']->attack($_SESSION['opponent']);
            break;
          case 'チョキ':
            History::set('負け！');
            $_SESSION['opponent']->attack($_SESSION['player']);
            break;
          case 'パー':
            History::set('あいこ！');
            break;
        }
      }

      if ($_SESSION['player']->getHp() <= 0) {
        gameOver();
      } else {
        if ($_SESSION['opponent']->getHp() <= 0) {
          History::set($_SESSION['opponent']->getName() . 'が倒れた！');
          createOpponent();
          $_SESSION['knockDownCount'] = $_SESSION['knockDownCount'] + 1;
        }
      }
    }
  }
  $_POST = array();
}
?>
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>じゃんけんゲーム</title>
  <link rel="stylesheet" href="css/style.css">
  <script src="js/jquery-3.4.1.min.js"></script>
  <script src="js/app.js"></script>
</head>

<body>
  <div class="ly_cont">
    <h1 class="el_title">じゃんけんゲーム</h1>
    <?php if (empty($_SESSION)) { ?>
      <form action="" method="post">
        <div class="ly_startContents">
          <button class="el_btn" value="start" name="start">ゲームスタート！</button>
        </div>
      </form>
    <?php } else { ?>
      <div class="ly_mainArea">
        <div class="bl_battleArea">
          <div class="bl_myArea">
            <p class="bl_name">自分</p>
            <?php if ($choiceFlg) { ?>
              <figure class="bl_janken">
                <img src="<?php echo $playerHandImg ?>" alt="">
              </figure>
            <?php } ?>
            <p class="bl_hp">自分の残りHP:<?php echo $_SESSION['player']->getHp() ?></p>
            <p class="bl_hp">倒した相手の数:<?php echo $_SESSION['knockDownCount'] ?></p>
          </div>
          <p class="el_vs">vs</p>
          <div class="bl_opponentArea">
            <p class="bl_name"><?php echo $_SESSION['opponent']->getName() ?></p>
            <?php if ($choiceFlg) { ?>
              <figure class="bl_janken">
                <img src="<?php echo $opponentHandImg ?>" alt="">
              </figure>
            <?php } ?>
            <p class="bl_hp">相手の残りHP:<?php echo $_SESSION['opponent']->getHp() ?></p>
          </div>
        </div>
      </div>
      <h2 class="bl_subTitle">どれをだす？</h2>
      <form action="" method="post">
        <div class="bl_btnArea">
          <button class="el_btn js_btn_gu" name="choice" value="グー">グー</button>
          <button class="el_btn js_btn_choki" name="choice" value="チョキ">チョキ</button>
          <button class="el_btn js_btn_pa" name="choice" value="パー">パー</button>
        </div>
      </form>
      <form action="" method="post">
        <button class="el_btn hp_mt40" name="start" value="start">最初からやり直す</button>
      </form>
      <div class="bl_logArea">
        <p class="el_log"><?php echo $_SESSION['history'] ?></p>
      </div>
    <?php } ?>
  </div>
</body>

</html>