<template>
    <div id="compose-smartcontract">
        <ComposeContent v-model="smartContractCode"></ComposeContent>
        <ComposeCompile :source="smartContractCode"></ComposeCompile>
    </div>
</template>
<script>
    import ComposeContent from './ComposeContent.vue'
    import ComposeCompile from './ComposeCompile.vue'
    export default {
        components: { ComposeContent, ComposeCompile },
        data() {
            return {
                smartContractCode: `//Write your own contracts here. Currently compiles using solc v0.4.15+commit.bbb8e64f.
pragma solidity ^0.4.25;
contract test {
  uint public _supply;
  string public _name;
  address public _owner;
  constructor(uint supply, string name) public{
      _owner=msg.sender;
      _name=name;
      _supply=supply;
  }
  function changeName(string name) public{
    require(msg.sender==_owner);
    _name=name;
    emit NameChanged(name);
  }
  function changeSupply(uint supply) public{
    require(msg.sender==_owner);
    _supply=supply;
    emit SupplyChanged(supply);
  }
  event NameChanged(string name);
  event SupplyChanged(uint supply);
}`,
            }
        }
    }
</script>
