const mergeRequestId = process.env.CI_MERGE_REQUEST_IID;
const projectId = process.env.CI_PROJECT_ID;
const token = process.env.GIT_API_TOKEN;
const apiBaseUrl = process.env.CI_API_V4_URL;
const mergeRequestApiUrl = `${apiBaseUrl}/projects/${projectId}/merge_requests/${mergeRequestId}`;
const mergeRequestApprovalsApiUrl = `${mergeRequestApiUrl}/approvals`;

const requiredApprovesQty = 1;
const requiredApproverUserNames = new Set(['g.cheishvili', 'Tsomaia', 'mburduli1']);

const requiredApproversString = () => JSON.stringify(Array.from(requiredApproverUserNames).map(name => `@${name}`));

Promise.all(
  [mergeRequestApiUrl, mergeRequestApprovalsApiUrl].map(url => fetch(url, {
      headers: {
        'PRIVATE-TOKEN': token
      }
    }).then(r => r.json())
  )
).then(
  ([mergeRequestResponse, approvalResponse]) => {
    console.log(`Required approvers: ${requiredApproversString()}`)
    if (!process.env.GIT_OWNERS.split('/').includes('@' + mergeRequestResponse.author.username)) {
      requiredApproverUserNames.delete(mergeRequestResponse.author.username);
      console.log(`Merge request author '@${mergeRequestResponse.author.username}' removed from required approvers list, remaining approvers: ${requiredApproversString()}`);
    }
    return approvalResponse;
  }
).then(
  approvalResponse => {
    if (!approvalResponse.approved) {
      throw new Error(`Merge request is not approved`);
    }
    if (approvalResponse.approved_by.length < requiredApprovesQty) {
      throw new Error(`Not enough approvers, needs to be at least ${requiredApprovesQty}, but got ${approvalResponse.approved_by.length}`);
    }

    const approverUserNames = new Set(approvalResponse.approved_by.map(a => a.user.username));
    const isApprovedByAtLeastOneRequiredApproved = Array.from(requiredApproverUserNames).some(u => approverUserNames.has(u));
    if (!isApprovedByAtLeastOneRequiredApproved) {
      throw new Error(`Must be approved by at least one of the required approvers: ${Array.from(requiredApproverUserNames).join(', ')}; currently approved by: ${approverUserNames.size > 0 ? Array.from(approverUserNames).join(', ') : 'none'}`);
    }
    console.log('Approvals check passed');
  }
);
