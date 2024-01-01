//=============================================================================
// ExtendBuffAndDebuff.js
//=============================================================================
// [Change History]
// Ver 1.0.0 2017 May       First Release
// Ver 1.1.0 2018 Apr 22nd  Add function to customize each actor

/*:
 * @plugindesc Enamble more than 3 level buff/debuff, and so on.
 * @author Sasuke KANNAZUKI
 *
 * @param Buff Start Icon ID
 * @desc the top icon ID of the buff iconset.(default = 32)
 * @default 32
 *
 * @param Debuff Start Icon ID
 * @desc the top icon ID of the debuff iconset.(default = 48)
 * @default 48
 *
 * @param Super Buff Start Icon ID
 * @desc the top icon ID of the 3rd level buff iconset.
 * @default 320
 *
 * @param Super Debuff Start Icon ID
 * @desc the top icon ID of the 3rd level debuff iconset.
 * @default 336
 *
 * @param Max Buff Level
 * @desc recommend = 4. (default=2, and must be >= 2)
 * @default 4
 *
 * @param Max Debuff Level
 * @desc recommend = 4. (default=2, and must be >= 2) if you set negative value, changed absolated value.
 * @default 4
 *
 * @param Accumulate Turn
 * @desc (1: Yes, 0:No) Read [Additional Options 1] in help to set.
 * @default 1
 *
 * @param Buff Level Effect
 * @desc the percentage of change parameter by each buff/debuff (default: 25)
 * @default 25
 *
 * @help This plugin does not provide plugin commands.
 * [Summary]
 *  At default system, buff and debuff's max levels are 2.
 * This plugin enables more than 3 level buff/debuff.
 * You can change max level by yourself as you like.
 *
 * [About Icon ID, and Icon you must prepare]
 *  At default system, buff/debuff icons' ID is binded by core script.
 * The top of buff icon is binded as 32, debuff icon is 48.
 *  This plugin enables to change the icons' ID by options.
 *
 *  Here, there is the question. When we add more than 3 level buff/debuff,
 * how to set the icon ID?
 * Don't worry, the answer is that: it is also set by option.
 * You can set the top of 3-level buff/debuff icon by option.
 * if you increase max level, put each 8 iconset after the previous level.
 * (i.e. top of 4-level's icon ID is +8, 5-level(if you need)'s one is +16.
 *
 * [Additional Options 1: make longer the buff/debuff turns]
 *  At default, when 5 turn buff is added, the buff limit become 5 turn unless
 * the same state's buff's remain turn is more than 6.
 *  You can change the specification by the option:
 * In the case, when 5 turn buff is added, the buff limit increases 5 turn.
 * This is convenient because buff lasts long, on the other hand, debuff state
 * (probably by enemy) also would lasts long, and you might feel nightmare.
 * So, before choose this option, consider well.
 *
 * [Additional options 2: change rate of each buff/level effect]
 *  At default, each buff level changes 25% of normal parameter value.
 * You can change the parcentage by the option.
 *  You may find that sometimes debuff level exceeds deep, the parameter might
 * be less than 0, but in the case, the parameter will be no less than 1.
 *
 * [Additional option 3 : change above value on designated actor(s)]
 * If you want change buff/debuff max level and/or change rate of buff effect
 * only for designated actor's, please write down the actor's note as follows:
 *
 * <maxBuffAffected:6>   // make max buff level 6 for the actor.
 * <maxBuffAffected:-5>  // make max debuff level 5 for the actor.
 * <maxBuffAffected:5>   // the same the above (minus is omissible)
 * <buffLevelEffect:20>  // change rate of each buff/debuff become 20.
 *  (be sure the default value is 25)
 *
 * [Copyright]
 * This plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @plugindesc スキル/アイテムの能力値強化/弱体を3段階以上に設定可能
 * @author 神無月サスケ
 *
 * @param Buff Start Icon ID
 * @desc 能力値強化アイコンセットの開始アイコンIDです。(デフォルト:32)
 * @default 32
 *
 * @param Debuff Start Icon ID
 * @desc 能力値弱体アイコンセットの開始アイコンIDです。(デフォルト:48)
 * @default 48
 *
 * @param Super Buff Start Icon ID
 * @desc 3段階目の能力値強化アイコンセットの開始アイコンIDです。
 * @default 320
 *
 * @param Super Debuff Start Icon ID
 * @desc 3段階目の能力値弱体アイコンセットの開始アイコンIDです。
 * @default 336
 *
 * @param Max Buff Level
 * @desc 能力値強化の最大段階です。(推奨:4、デフォルト:2。必ず2以上に)
 * @default 4
 *
 * @param Max Debuff Level
 * @desc 能力値弱体の最大段階です。(推奨:4、デフォルト:2。必ず2以上に) 負の数を入れた場合は絶対値に置き換えられます。
 * @default 4
 *
 * @param Accumulate Turn
 * @desc (1:する、0:しない) ヘルプ「機能追加１」のターン上乗せ仕様を採用するか
 * @default 1
 *
 * @param Buff Level Effect
 * @desc 能力値強化/弱体1段階ごとに変化する能力値のパーセンテージ(デフォルト:25) * @default 25
 *
 * @help このプラグインには、プラグインコマンドはありません。
 *
 * ■概要
 * デフォルトでは、スキル/アイテムの能力値強化/弱体は、2段階まででした。
 * このプラグインは、3段階以上に上限を設定可能です。
 * 最大可能な段階の上限は無制限ですが、デフォルトでは4を推奨しています。
 *
 * ■アイコンIDについて(3段階以上は準備が必要)
 * 元来、能力値強化/弱体のアイコンIDは、スクリプトで固定されていました。
 * 能力値強化のアイコンセットは32番から、弱体のは48番からでした。
 * そして1段階強化/弱体されると+8番のアイコンセットが採用されました。
 *
 * まず、このプラグインは、能力値強化/弱体のアイコンセットの開始番号を
 * オプションで変更することが可能です。
 *
 * 次に、3段階以上の能力値強化/弱体のアイコンIDについてですが、
 * これもオプションで3段階目の能力値強化/弱体アイコンの開始番号を指定します。
 * そして1段階強化/弱体されると+8番のアイコンセットが採用されます。
 * (つまり、4段階目の能力値強化/弱体には、+8番のアイコンセットが、
 * 仮に5段階目を作るなら、+16番からのアイコンセットが使用されます）
 *
 * ■最悪でも、どの能力値も 1(MPは0)以下にはならない：
 * 仮に、何段階も能力値弱体をかけた結果、効果が100％を超え、
 * 負の値になる可能性もありますね。
 * そんな場合でも、能力値は最低1未満になることはありません。
 * (MPに限っては、最低値は0です)
 *
 * ■機能追加１：能力値強化/弱体の重ね掛け時のターン数を長くするオプション
 * デフォルトでは、「能力強化　5ターン」の技をかけた場合、
 * その時の能力強化の効果が残り6ターン以下なら、5ターンで効果が全て切れます。
 * これは多重に重ね掛けをしたい場合は、不利な仕様と言えます。
 *
 * このため、「能力強化　5ターン」の技を掛ければ、常にその能力強化のターン数が
 * 5ターン増加するようにすることが、オプションによって、設定可能です。
 *
 * ただし注意が一点。「能力弱体」も同じ仕様になるため、仮に敵から能力弱体を
 * 重ね掛けされた場合、プレイヤーは困惑するでしょう。
 * よって、導入前によく考えてください
 *
 * ■機能追加２：能力値強化/弱体の際の能力変動値を25％から変更可能
 * デフォルトでは、能力値強化/弱体が1段階付くと、その能力値は従来の値から
 * 25%増減します。最大で2段階までなら、±50%の範囲内になる、といえますね。
 *
 * このパーセンテージも、オプションで変更可能です。
 *
 * ■拡張機能３：特定のアクターだけ、上記の値を変更
 * 特定のアクターだけ、強化/弱体の最大レベルを変更したり、
 * １回の強化／弱体で変更する能力値の割合を変更したい場合、
 * そのアクターのメモに、以下のように記述してください。
 *
 * <maxBuffAffected:6>   // 最大レベルが６になります
 * <maxBuffAffected:5>   // 最小レベルが５になります
 * <maxBuffAffected:-5>  // 最小レベルは、負の値で記述してもかまいません
 * <buffLevelEffect:20>  // １回の変動値が20%になります。(デフォルト＝25)
 *
 * [著作権表示]
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(function () {
  //
  // process parameters
  //
  var parameters = PluginManager.parameters("ExtendBuffAndDebuff");
  var iconBuffStart = Number(parameters["Buff Start Icon ID"] || 32);
  var iconDebuffStart = Number(parameters["Debuff Start Icon ID"] || 48);
  var iconSuperBuffStart = Number(
    parameters["Super Buff Start Icon ID"] || 320
  );
  var iconSuperDebuffStart = Number(
    parameters["Super Debuff Start Icon ID"] || 336
  );
  var maxBuffAffected = Number(parameters["Max Buff Level"] || 4);
  var maxDebuffAffected = Number(parameters["Max Debuff Level"] || 4);
  maxDebuffAffected = -Math.abs(maxDebuffAffected);
  var doAddBuffTurns = !!Number(parameters["Accumulate Turn"]);
  var buffLevelEffect = Number(parameters["Buff Level Effect"] || 25) / 100.0;

  //
  // Change and Define Icons
  //
  Game_BattlerBase.ICON_BUFF_START = iconBuffStart;
  Game_BattlerBase.ICON_DEBUFF_START = iconDebuffStart;

  var _Game_BattlerBase_buffIconIndex =
    Game_BattlerBase.prototype.buffIconIndex;
  Game_BattlerBase.prototype.buffIconIndex = function (buffLevel, paramId) {
    if (Math.abs(buffLevel) > 2) {
      var index = buffLevel > 0 ? iconSuperBuffStart : iconSuperDebuffStart;
      return index + (Math.abs(buffLevel) - 3) * 8 + paramId;
    } else {
      return _Game_BattlerBase_buffIconIndex.call(this, buffLevel, paramId);
    }
  };

  //
  // For Addtional Option 3 (ver1.1 : get each actor/enemy's value)
  //
  Game_BattlerBase.prototype.maxBuffAffected = function () {
    return maxBuffAffected;
  };

  Game_Actor.prototype.maxBuffAffected = function () {
    var e = this.actor().meta.maxBuffAffected;
    return isNaN(Number(e)) ? maxBuffAffected : Number(e);
  };

  Game_BattlerBase.prototype.maxDebuffAffected = function () {
    return maxDebuffAffected;
  };

  Game_Actor.prototype.maxDebuffAffected = function () {
    var e = this.actor().meta.maxDebuffAffected;
    return isNaN(Number(e)) ? maxDebuffAffected : -Math.abs(Number(e));
  };

  Game_BattlerBase.prototype.buffLevelEffect = function () {
    return buffLevelEffect;
  };

  Game_Actor.prototype.buffLevelEffect = function () {
    var e = this.actor().meta.buffLevelEffect;
    return isNaN(Number(e)) ? buffLevelEffect : Number(e) / 100.0;
  };

  //
  // Define buff/debuff level limitation
  //
  Game_BattlerBase.prototype.isMaxBuffAffected = function (paramId) {
    return this._buffs[paramId] === this.maxBuffAffected();
  };
  Game_BattlerBase.prototype.isMaxDebuffAffected = function (paramId) {
    return this._buffs[paramId] === this.maxDebuffAffected();
  };

  //
  // Additional Options 1: Accumulate turns or not
  //
  var _Game_BattlerBase_overwriteBuffTurns =
    Game_BattlerBase.prototype.overwriteBuffTurns;
  Game_BattlerBase.prototype.overwriteBuffTurns = function (paramId, turns) {
    if (doAddBuffTurns) {
      this._buffTurns[paramId] += turns;
    } else {
      _Game_BattlerBase_overwriteBuffTurns.call(this, paramId, turns);
    }
  };

  //
  // Additional options 2: change rate of each buff/level effect
  //
  Game_BattlerBase.prototype.paramBuffRate = function (paramId) {
    return this._buffs[paramId] * this.buffLevelEffect() + 1.0;
  };
})();
