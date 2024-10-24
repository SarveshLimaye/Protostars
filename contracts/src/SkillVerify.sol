// SPDX-License-Identifier: MIT 
pragma solidity 0.8.20;
import "reclaim-contracts/Reclaim.sol";

contract SkillVerify {
    //State variables
    address owner;
    uint256 internal totalCompanies = 0;
    uint256 internal totalUsers = 0;
    address public reclaimAddress;

    //Mappings
    mapping (uint256 => CompanyInfo) public companyIdToCompany;
    mapping (uint256 => UserInfo) public userIdtoUser;
    mapping (address => uint256) public walletAddressToId;
    mapping(string => uint256) public emailToUserId;

    //Structs
    struct CompanyInfo{
        uint256 id;
        string companyName;
        string email;
        string industry;
        uint256 teamSize;
    }

    struct UserInfo{
        uint256 id;
        address walletAddress;
        string mail;
        string githubProfile;
        string linkdeinProfile;
        string githubContributions;
        string lastRole;
        string lastCompany;
        uint256 tierList;
    }

    //Events
    event CompanyCreated(uint256 indexed id,string companyName, string email, string industry, uint256 teamSize);
    event UserCreated(uint256 indexed id,string githubProfile,string linkdeinProfile,uint256 tierList);
    event EmploymentVerified(string company,string role);
    event GithubContributionsVerified(string contributions);

    constructor(address _reclaimAddress) {
        owner = msg.sender;
        reclaimAddress = _reclaimAddress;
    }

    //Register new Company
    function registerCompany(string memory companyName,string memory email, string memory industry,uint256 teamSize) public {
           totalCompanies++;
           CompanyInfo memory newCompany =  CompanyInfo(
             totalCompanies,
             companyName,
             email,
             industry,
             teamSize
           );
           companyIdToCompany[totalCompanies] = newCompany;
          
           emit CompanyCreated(totalCompanies, companyName, email, industry, teamSize);
    }

    // Register new User
    function registerUser(address walletAddress,string memory linkdeinProfile,string memory githubProfile,string memory email) public {
        totalUsers++;
        UserInfo memory newUser = UserInfo(
            totalUsers,
            walletAddress,
            email,
            githubProfile,
            linkdeinProfile, 
            "",
            "",
            "",
            0
        );
        emailToUserId[email] = totalUsers;
        userIdtoUser[totalUsers] = newUser;
        walletAddressToId[walletAddress] = totalUsers; 
        emit UserCreated(totalUsers, githubProfile,linkdeinProfile,0);
    }

     function verifyProofGithub(Reclaim.Proof memory proof,string memory context,string memory contributionField) public returns(bool){
         Reclaim(reclaimAddress).verifyProof(proof);
         uint256 userId = walletAddressToId[msg.sender];
         require(userId != 0,"User not registered");
         UserInfo storage user = userIdtoUser[userId];
         string memory contributions = extractFieldFromContext(context,contributionField);
         user.githubContributions = contributions;
         emit  GithubContributionsVerified(contributions);
         return true; 
        }


     function verifyProofLinkedin(Reclaim.Proof memory proof,string memory context,string memory roleField,string memory companyField) public returns(bool){
         Reclaim(reclaimAddress).verifyProof(proof);
         uint256 userId = walletAddressToId[msg.sender];
         UserInfo storage user = userIdtoUser[userId];
         require(userId != 0,"User not registered");
         string memory company = extractFieldFromContext(context,companyField);
         string memory role = extractFieldFromContext(context,roleField);
         user.lastCompany = company;
         user.lastRole = role;
         emit EmploymentVerified(company, role);
         return true; 
        }

   	function extractFieldFromContext(
		string memory data,
		string memory target
	) public pure returns (string memory) {
		bytes memory dataBytes = bytes(data);
		bytes memory targetBytes = bytes(target);

		require(dataBytes.length >= targetBytes.length, "target is longer than data");
		uint start = 0;
		bool foundStart = false;
		// Find start of "contextMessage":"

		for (uint i = 0; i <= dataBytes.length - targetBytes.length; i++) {
			bool isMatch = true;

			for (uint j = 0; j < targetBytes.length && isMatch; j++) {
				if (dataBytes[i + j] != targetBytes[j]) {
					isMatch = false;
				}
			}

			if (isMatch) {
				start = i + targetBytes.length; // Move start to the end of "contextMessage":"
				foundStart = true;
				break;
			}
		}

		if (!foundStart) {
			return ""; // Malformed or missing message
		}
		// Find the end of the message, assuming it ends with a quote not preceded by a backslash
		uint end = start;
		while (
			end < dataBytes.length &&
			!(dataBytes[end] == '"' && dataBytes[end - 1] != "\\")
		) {
			end++;
		}
		if (end <= start) {
			return ""; // Malformed or missing message
		}
		bytes memory contextMessage = new bytes(end - start);
		for (uint i = start; i < end; i++) {
			contextMessage[i - start] = dataBytes[i];
		}
		return string(contextMessage);
	}


    //External and View Functions - 
    function getTotalCompanies() external view returns (uint256){
        return totalCompanies;
    }

    function getTotalUsers() external view returns(uint256){
        return totalUsers;
    }

}