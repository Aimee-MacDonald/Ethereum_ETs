//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

////
//  NOT IN PRODUCTION
//
import "hardhat/console.sol";
//
//  NOT IN PRODUCTION
////

contract Utils {
  function appendString(bytes memory buffer, string memory str) public pure {
    uint256 strLength = bytes(str).length;
    uint256 length = buffer.length;

    assembly {
      let strptr := add(str, 0x20)
      let bufferptr := add(buffer, add(0x20, length))
      let l := strLength

      for {} gt(l, 31) { l := sub(l, 32) } { 
        mstore(bufferptr, mload(strptr))
        strptr := add(strptr, 32)
        bufferptr := add(bufferptr, 32)
      }

      if gt(l, 0) {
        let shift := shl(3, sub(32, l))
        let strc := shl(shift, shr(shift, mload(strptr)))
        mstore(bufferptr, strc)
      }
  
      mstore(buffer, add(length, strLength))
    }        
  }

  function toString(uint256 number) public pure returns (string memory) {
    bytes memory buffer = new bytes(32);
    
    assembly {
      mstore(buffer, 0)
    }

    uint256 str = 0;
    uint256 strLength = 0;
    
    unchecked {
      do {
        uint256 digit = (number % 10) + 48;
        str = (str >> 8) | (digit << 248);
        number /= 10;
        strLength++;
      } while (number > 0);
    }
    
    uint256 length = buffer.length;

    assembly {
      let shift := shl(3, sub(32, strLength))
      let strc := shl(shift, shr(shift, str))

      let bufferptr := add(buffer, add(0x20, length))
      mstore(bufferptr, strc)
      mstore(buffer, add(length, strLength))
    }

    return string(buffer);
  }

  // Original Author: Brecht Devos <brecht@loopring.org>
  function encodeBase64(bytes memory data) external pure returns (string memory) {
    bytes memory TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    uint256 len = data.length;
    if (len == 0) return '';
    
    // multiply by 4/3 rounded up
    uint256 encodedLen = 4 * ((len + 2) / 3);

    // Add some extra buffer at the end
    bytes memory result = new bytes(encodedLen + 32);

    bytes memory table = TABLE;
    
    assembly {
      let tablePtr := add(table, 1)
      let resultPtr := add(result, 32)

      for {
        let i := 0
      } lt(i, len) {
      } {
        i := add(i, 3)
        let input := and(mload(add(data, i)), 0xffffff)

        let out := mload(add(tablePtr, and(shr(18, input), 0x3F)))
        out := shl(8, out)
        out := add(
          out,
          and(mload(add(tablePtr, and(shr(12, input), 0x3F))), 0xFF)
        )
        out := shl(8, out)
        out := add(
          out,
          and(mload(add(tablePtr, and(shr(6, input), 0x3F))), 0xFF)
        )
        out := shl(8, out)
        out := add(
          out,
          and(mload(add(tablePtr, and(input, 0x3F))), 0xFF)
        )
        out := shl(224, out)
        mstore(resultPtr, out)
        resultPtr := add(resultPtr, 4)
      }

      switch mod(len, 3)
      case 1 {
        mstore(sub(resultPtr, 2), shl(240, 0x3d3d))
      }
      case 2 {
        mstore(sub(resultPtr, 1), shl(248, 0x3d))
      }

      mstore(result, encodedLen)
    }

    return string(result);
  }

  function constructJSON(IEthets.VisualData memory tokenVisuals, IEthets.Statistics memory tokenStats) external pure returns (string memory) {
    bytes memory attributesBuffer = new bytes(320);
    assembly { mstore(attributesBuffer, 0) }

    appendString(attributesBuffer, '[{"trait_type":"background","value":"');
    appendString(attributesBuffer, tokenVisuals.background);
    appendString(attributesBuffer, '"},');

    appendString(attributesBuffer, '{"trait_type":"belt","value":"');
    appendString(attributesBuffer, tokenVisuals.belt);
    appendString(attributesBuffer, '"},');

    appendString(attributesBuffer, '{"trait_type":"face accessory","value":"');
    appendString(attributesBuffer, tokenVisuals.face_accessory);
    appendString(attributesBuffer, '"},');

    appendString(attributesBuffer, '{"trait_type":"head_gear","value":"');
    appendString(attributesBuffer, tokenVisuals.head_gear);
    appendString(attributesBuffer, '"},');

    appendString(attributesBuffer, '{"trait_type":"outfit","value":"');
    appendString(attributesBuffer, tokenVisuals.outfit);
    appendString(attributesBuffer, '"},');

    appendString(attributesBuffer, '{"trait_type":"rank","value":"');
    appendString(attributesBuffer, tokenVisuals.rank);
    appendString(attributesBuffer, '"},');

    appendString(attributesBuffer, '{"trait_type":"type","value":"');
    appendString(attributesBuffer, tokenVisuals.token_type);
    appendString(attributesBuffer, '"},');

    appendString(attributesBuffer, '{"trait_type":"weapon","value":"');
    appendString(attributesBuffer, tokenVisuals.weapon);
    appendString(attributesBuffer, '"},');

    appendString(attributesBuffer, '{"display_type":"boost_number","trait_type":"firing_range","value":');
    appendString(attributesBuffer, toString(tokenStats.firing_range));
    appendString(attributesBuffer, ',"max_value":100},');

    appendString(attributesBuffer, '{"display_type":"boost_number","trait_type":"firing_speed","value":');
    appendString(attributesBuffer, toString(tokenStats.firing_speed));
    appendString(attributesBuffer, ',"max_value":100},');

    appendString(attributesBuffer, '{"display_type":"boost_number","trait_type":"reload_speed","value":');
    appendString(attributesBuffer, toString(tokenStats.reload_speed));
    appendString(attributesBuffer, ',"max_value":100},');

    appendString(attributesBuffer, '{"display_type":"boost_number","trait_type":"melee_damage","value":');
    appendString(attributesBuffer, toString(tokenStats.melee_damage));
    appendString(attributesBuffer, ',"max_value":100},');

    appendString(attributesBuffer, '{"display_type":"boost_number","trait_type":"melee_speed","value":');
    appendString(attributesBuffer, toString(tokenStats.melee_speed));
    appendString(attributesBuffer, ',"max_value":100},');

    appendString(attributesBuffer, '{"display_type":"boost_number","trait_type":"magazine_capacity","value":');
    appendString(attributesBuffer, toString(tokenStats.magazine_capacity));
    appendString(attributesBuffer, ',"max_value":100},');

    appendString(attributesBuffer, '{"display_type":"boost_number","trait_type":"health","value":');
    appendString(attributesBuffer, toString(tokenStats.health));
    appendString(attributesBuffer, ',"max_value":100}]');

    return string(attributesBuffer);
  }

  function constructImageURL(string memory baseTokenURI, uint256 tokenId) external returns (string memory) {
    bytes memory stringBytes = bytes(baseTokenURI);
    require(stringBytes.length != 0, "Ethets: Image URL not set");

    bytes memory urlBuffer = new bytes(100);
    assembly { mstore(urlBuffer, 0) }
    
    appendString(urlBuffer, baseTokenURI);
    appendString(urlBuffer, toString(tokenId));
    appendString(urlBuffer, ".png");

    return string(urlBuffer);
  }
}

interface IEthets {
  struct Statistics {
    uint8 firing_range;
    uint8 firing_speed;
    uint8 reload_speed;
    uint8 melee_damage;
    uint8 melee_speed;
    uint8 magazine_capacity;
    uint8 health;
  }

  struct VisualData {
    string background;
    string outfit;
    string belt;
    string token_type;
    string face_accessory;
    string head_gear;
    string weapon;
    string rank;
  }
}