import { Octokit } from '@octokit/rest';

export const createGitHubClient = (token) => {
  return new Octokit({ auth: token });
};

/**
 * Thao tác Batch Commit nhiều file cùng lúc bằng Github Tree API.
 * @param {Octokit} octokit 
 * @param {string} owner 
 * @param {string} repo 
 * @param {string} branch 
 * @param {Array} files - Mảng các file: { path: string, content: string, isBase64: boolean, isDelete: boolean }
 * @param {string} message 
 */
export const commitChanges = async (octokit, owner, repo, branch, files, message) => {
  const timestamp = new Date().getTime();

  // 1. Get current commit object (Bypass cache using query param t)
  const { data: refData } = await octokit.request(`GET /repos/{owner}/{repo}/git/ref/{ref}?t=${timestamp}`, {
    owner,
    repo,
    ref: `heads/${branch}`
  });
  const currentCommitSha = refData.object.sha;

  // 2. Get the tree of that commit
  const { data: commitData } = await octokit.request(`GET /repos/{owner}/{repo}/git/commits/{commit_sha}?t=${timestamp}`, {
    owner,
    repo,
    commit_sha: currentCommitSha
  });
  const currentTreeSha = commitData.tree.sha;

  // 3. Prepare the tree array
  const tree = await Promise.all(files.map(async (file) => {
    if (file.isDelete) {
      // Để xóa một file, gán sha là null
      return {
        path: file.path,
        mode: '100644',
        type: 'blob',
        sha: null
      };
    }

    if (file.isBase64) {
      // Với ảnh (base64), cần tạo blob riêng trước vì Github API giới hạn truyền trực tiếp base64 trong createTree
      const { data: blobData } = await octokit.git.createBlob({
        owner, repo, content: file.content, encoding: 'base64'
      });
      return {
        path: file.path,
        mode: '100644',
        type: 'blob',
        sha: blobData.sha
      };
    } else {
      // Với text file (data.json)
      return {
        path: file.path,
        mode: '100644',
        type: 'blob',
        content: file.content
      };
    }
  }));

  // 4. Create new tree
  const { data: newTreeData } = await octokit.git.createTree({
    owner, repo, tree, base_tree: currentTreeSha
  });

  // 5. Create new commit
  const { data: newCommitData } = await octokit.git.createCommit({
    owner, repo, message, tree: newTreeData.sha, parents: [currentCommitSha]
  });

  // 6. Update branch reference
  await octokit.git.updateRef({
    owner, repo, ref: `heads/${branch}`, sha: newCommitData.sha
  });

  return newCommitData.sha;
};
